
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
    const { userId, dataSourceId } = requestData;

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

    console.log("Validating ESG data for user:", userId);

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

    // Perform validation
    const validationResults = await validateESGData(esgData);
    
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

// Function to validate ESG data
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
