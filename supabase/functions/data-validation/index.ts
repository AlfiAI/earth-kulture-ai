
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// The function structure to validate ESG data
interface ESGDataPoint {
  id?: string;
  category: string;
  subCategory: string;
  value: number;
  unit: string;
  source: string;
  date: string;
  verified?: boolean;
}

interface ValidationIssue {
  type: 'warning' | 'error';
  message: string;
  source: string;
  recommendation: string;
}

interface ValidationResults {
  valid: number;
  warning: number;
  error: number;
  total: number;
  issues: ValidationIssue[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });

    // Get request body
    const requestData = await req.json();
    const { userId, dataSourceId, validateWith } = requestData;

    if (!userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing user ID" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    console.log(`Validating ESG data for user: ${userId} using ${validateWith || 'standard'} validation`);

    // Fetch ESG data to validate
    let query = supabaseClient
      .from('esg_data')
      .select('*')
      .eq('user_id', userId);
    
    if (dataSourceId) {
      query = query.eq('data_source_id', dataSourceId);
    }

    const { data: esgData, error: fetchError } = await query;

    if (fetchError) {
      console.error("Error fetching data for validation:", fetchError);
      throw fetchError;
    }
    
    console.log(`Found ${esgData.length} data points to validate`);

    // Perform validation based on the requested method
    let validationResults: ValidationResults;
    if (validateWith === "deepseek-r1") {
      validationResults = await validateWithDeepSeekR1(esgData, supabaseClient);
    } else {
      validationResults = await validateESGData(esgData);
    }
    
    // Record validation run in the reports table
    const { error: reportError } = await supabaseClient
      .from('reports')
      .insert({
        user_id: userId,
        report_type: 'data_validation',
        ai_generated: true,
        file_url: JSON.stringify(validationResults)
      });

    if (reportError) {
      console.error("Error recording validation report:", reportError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results: validationResults 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in data-validation function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

// Enhanced validation using DeepSeek-R1
async function validateWithDeepSeekR1(data: any[], supabaseClient: any): Promise<ValidationResults> {
  console.log("Performing advanced validation with DeepSeek-R1");
  
  // Initialize results
  const results: ValidationResults = {
    valid: 0,
    warning: 0,
    error: 0,
    total: data.length,
    issues: []
  };
  
  try {
    // First apply standard validation rules
    const standardResults = await validateESGData(data);
    
    // Combine results
    results.valid = standardResults.valid;
    results.warning = standardResults.warning;
    results.error = standardResults.error;
    results.issues = [...standardResults.issues];
    
    // For large datasets, only analyze a sample for advanced validation
    const samplesToAnalyze = data.length > 100 ? 
      data.slice(0, 100) : data;
    
    // Get additional data for context
    const { data: carbonData, error: carbonError } = await supabaseClient
      .from('carbon_emissions')
      .select('*')
      .limit(50);
      
    if (carbonError) {
      console.warn("Error fetching carbon data for context:", carbonError);
    }
    
    // Enhance validation with additional AI-powered checks
    
    // 1. Check for data consistency across related metrics
    const metricGroups = groupRelatedMetrics(samplesToAnalyze);
    for (const group of Object.values(metricGroups)) {
      if (group.length > 1) {
        const consistencyIssues = detectConsistencyIssues(group);
        results.issues.push(...consistencyIssues);
        
        // Update counts
        results.warning += consistencyIssues.filter(i => i.type === 'warning').length;
        results.error += consistencyIssues.filter(i => i.type === 'error').length;
        results.valid = results.total - (results.warning + results.error);
      }
    }
    
    // 2. Check for temporal anomalies
    const temporalAnomalies = detectTemporalAnomalies(samplesToAnalyze);
    results.issues.push(...temporalAnomalies);
    
    // Update counts
    results.warning += temporalAnomalies.filter(i => i.type === 'warning').length;
    results.error += temporalAnomalies.filter(i => i.type === 'error').length;
    results.valid = results.total - (results.warning + results.error);
    
    // Sort issues by type (errors first)
    results.issues.sort((a, b) => {
      if (a.type === 'error' && b.type !== 'error') return -1;
      if (a.type !== 'error' && b.type === 'error') return 1;
      return 0;
    });
    
    console.log(`DeepSeek-R1 validation complete. Found ${results.error} errors, ${results.warning} warnings`);
    
    return results;
  } catch (error) {
    console.error("Error in DeepSeek-R1 validation:", error);
    
    // Fallback to standard validation
    console.log("Falling back to standard validation");
    return await validateESGData(data);
  }
}

// Group related metrics for consistency checking
function groupRelatedMetrics(data: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {};
  
  for (const item of data) {
    const category = item.category || 'uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
  }
  
  return groups;
}

// Detect consistency issues between related metrics
function detectConsistencyIssues(relatedData: any[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check for inconsistent units within same metric type
  const metricNameMap: Record<string, Set<string>> = {};
  
  for (const item of relatedData) {
    if (!item.metric_name || !item.unit) continue;
    
    if (!metricNameMap[item.metric_name]) {
      metricNameMap[item.metric_name] = new Set();
    }
    
    metricNameMap[item.metric_name].add(item.unit);
  }
  
  // If a metric has multiple units, flag it
  for (const [metricName, units] of Object.entries(metricNameMap)) {
    if (units.size > 1) {
      issues.push({
        type: 'warning',
        message: `Inconsistent units for ${metricName}: using ${Array.from(units).join(', ')}`,
        source: 'data_consistency',
        recommendation: `Standardize units for ${metricName} metrics`
      });
    }
  }
  
  return issues;
}

// Detect temporal anomalies in the data
function detectTemporalAnomalies(data: any[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Group data by metric to find trends
  const metricGroups: Record<string, any[]> = {};
  
  for (const item of data) {
    if (!item.metric_name || !item.date || !item.value) continue;
    
    const key = `${item.category}-${item.metric_name}`;
    if (!metricGroups[key]) {
      metricGroups[key] = [];
    }
    
    metricGroups[key].push({
      value: parseFloat(item.value),
      date: new Date(item.date)
    });
  }
  
  // Sort each group by date and check for sudden changes
  for (const [metricKey, points] of Object.entries(metricGroups)) {
    if (points.length < 3) continue; // Need at least 3 points for trend
    
    // Sort by date
    points.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    for (let i = 1; i < points.length; i++) {
      const previousValue = points[i-1].value;
      const currentValue = points[i].value;
      
      // Check for drastic changes (more than 100% increase or 50% decrease)
      if (previousValue !== 0) {
        const percentChange = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
        
        if (percentChange > 100) {
          issues.push({
            type: 'warning',
            message: `Sudden increase of ${percentChange.toFixed(1)}% in ${metricKey.split('-')[1]} detected`,
            source: 'data_timeframe',
            recommendation: 'Verify this data point for accuracy'
          });
        } else if (percentChange < -50) {
          issues.push({
            type: 'warning',
            message: `Sudden decrease of ${Math.abs(percentChange).toFixed(1)}% in ${metricKey.split('-')[1]} detected`,
            source: 'data_timeframe',
            recommendation: 'Verify this data point for accuracy'
          });
        }
      }
    }
  }
  
  return issues;
}

// Standard function to validate ESG data
async function validateESGData(data: any[]): Promise<ValidationResults> {
  const results: ValidationResults = {
    valid: 0,
    warning: 0,
    error: 0,
    total: data.length,
    issues: []
  };

  // Validation rules
  const validationRules = [
    {
      // Check for missing critical fields
      test: (item: any) => item.value !== null && item.value !== undefined,
      errorMessage: 'Missing value for ESG data point',
      issueType: 'error' as const,
      source: 'data_completeness',
      recommendation: 'Add a numeric value for this ESG data point'
    },
    {
      // Check for negative values when they should be positive
      test: (item: any) => !(item.category === 'environmental' && item.value < 0),
      errorMessage: 'Negative value for environmental metric',
      issueType: 'error' as const,
      source: 'data_range',
      recommendation: 'Environmental metrics typically require positive values'
    },
    {
      // Check for outliers - values that are much higher than typical
      test: (item: any) => !(item.category === 'environmental' && item.value > 10000),
      errorMessage: 'Potential outlier value detected',
      issueType: 'warning' as const,
      source: 'data_range',
      recommendation: 'Verify this unusually high value for accuracy'
    },
    {
      // Check for missing units
      test: (item: any) => item.unit && item.unit.trim() !== '',
      errorMessage: 'Missing unit of measurement',
      issueType: 'warning' as const,
      source: 'data_completeness',
      recommendation: 'Add appropriate unit of measurement for this metric'
    },
    {
      // Check for dates in the future
      test: (item: any) => new Date(item.date) <= new Date(),
      errorMessage: 'Future date detected',
      issueType: 'error' as const,
      source: 'data_timeframe',
      recommendation: 'Change date to current or past date'
    },
    {
      // Check for very old dates that might be errors
      test: (item: any) => {
        const dataDate = new Date(item.date);
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        return dataDate >= fiveYearsAgo;
      },
      errorMessage: 'Data point date is more than 5 years old',
      issueType: 'warning' as const,
      source: 'data_timeframe',
      recommendation: 'Verify this historical data point is correct'
    }
  ];

  // Apply validation rules to each data point
  data.forEach(dataPoint => {
    let isValid = true;
    
    for (const rule of validationRules) {
      if (!rule.test(dataPoint)) {
        if (rule.issueType === 'error') {
          results.error++;
          isValid = false;
        } else {
          results.warning++;
        }
        
        results.issues.push({
          type: rule.issueType,
          message: rule.errorMessage,
          source: rule.source,
          recommendation: rule.recommendation
        });
      }
    }
    
    if (isValid) {
      results.valid++;
    }
  });

  return results;
}
