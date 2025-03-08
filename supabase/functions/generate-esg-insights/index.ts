
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ESGInsight {
  id?: string;
  userId: string;
  type: 'trend' | 'alert' | 'recommendation' | 'info';
  title: string;
  description: string;
  indicator?: 'up' | 'down' | 'neutral';
  percentageChange?: number;
  date: string;
  category: 'environmental' | 'social' | 'governance' | 'general';
  priority?: 'low' | 'medium' | 'high';
  relatedMetrics?: string[];
  actionable?: boolean;
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
    const { userId, useDeepSeekR1 = true } = requestData;
    
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

    console.log(`Generating ESG insights for user: ${userId} using ${useDeepSeekR1 ? 'DeepSeek-R1' : 'standard'} analysis`);
    
    // Start Performance tracking
    const startTime = performance.now();
    
    // Fetch data from optimized materialized views
    const { data: esgSummaryData, error: esgSummaryError } = await supabaseClient
      .from('esg_analytics_summary')
      .select('*')
      .eq('user_id', userId)
      .order('month', { ascending: false })
      .limit(24); // Last 2 years of data
      
    if (esgSummaryError) {
      console.error("Error fetching ESG summary data:", esgSummaryError);
      throw esgSummaryError;
    }
    
    const { data: carbonSummaryData, error: carbonSummaryError } = await supabaseClient
      .from('carbon_emissions_summary')
      .select('*')
      .eq('user_id', userId)
      .order('month', { ascending: false })
      .limit(24); // Last 2 years of data
      
    if (carbonSummaryError) {
      console.error("Error fetching carbon summary data:", carbonSummaryError);
      throw carbonSummaryError;
    }
    
    // Fetch compliance data for more context
    const { data: complianceData, error: complianceError } = await supabaseClient
      .from('compliance_status')
      .select('*, compliance_frameworks(*)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(20);
      
    if (complianceError) {
      console.error("Error fetching compliance data:", complianceError);
      // Non-critical error, continue with available data
    }
    
    // Generate insights based on data
    let insights: ESGInsight[];
    
    if (useDeepSeekR1) {
      insights = await generateDeepSeekInsights(
        userId, 
        esgSummaryData || [], 
        carbonSummaryData || [], 
        complianceData || []
      );
    } else {
      insights = generateBasicInsights(userId, esgSummaryData, carbonSummaryData);
    }
    
    // Performance tracking
    const endTime = performance.now();
    console.log(`Generated ${insights.length} insights in ${Math.round(endTime - startTime)}ms`);
    
    // Store insights in the database
    for (const insight of insights) {
      const { error: insertError } = await supabaseClient
        .from('reports')
        .insert({
          user_id: userId,
          report_type: 'esg_insight',
          ai_generated: true,
          file_url: JSON.stringify(insight)
        });
        
      if (insertError) {
        console.error("Error saving insight:", insertError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        insights: insights,
        analysisTime: Math.round(endTime - startTime)
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in generate-esg-insights function:", error);
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

// Advanced insights generation with DeepSeek-R1 capabilities
async function generateDeepSeekInsights(
  userId: string,
  esgData: any[],
  carbonData: any[],
  complianceData: any[]
): Promise<ESGInsight[]> {
  const insights: ESGInsight[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  try {
    // Advanced trend detection for environmental metrics
    if (esgData.length >= 2) {
      const environmentalData = esgData
        .filter(item => item.category === 'environmental')
        .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());
      
      if (environmentalData.length >= 2) {
        const trends = detectEnvironmentalTrends(environmentalData);
        insights.push(...trends);
      }
    }
    
    // Enhanced carbon emissions analysis
    if (carbonData.length >= 2) {
      const carbonTrends = detectCarbonTrends(carbonData);
      const carbonRecommendations = generateCarbonRecommendations(carbonData);
      
      insights.push(...carbonTrends);
      insights.push(...carbonRecommendations);
    }
    
    // Compliance risk analysis
    if (complianceData.length > 0) {
      const complianceInsights = analyzeComplianceRisks(complianceData, userId, today);
      insights.push(...complianceInsights);
    }
    
    // Add generic insights if we don't have enough data-driven ones
    if (insights.length < 3) {
      insights.push({
        userId,
        type: 'recommendation',
        title: 'Expand your ESG data collection',
        description: 'Adding more comprehensive ESG metrics will enable more personalized insights and recommendations.',
        date: today,
        category: 'general',
        priority: 'medium',
        actionable: true
      });
    }
    
    // Prioritize insights
    return prioritizeInsights(insights);
  } catch (error) {
    console.error("Error generating DeepSeek insights:", error);
    // Fallback to basic insights
    return generateBasicInsights(userId, esgData, carbonData);
  }
}

// Detect environmental trends using advanced algorithms
function detectEnvironmentalTrends(environmentalData: any[]): ESGInsight[] {
  const insights: ESGInsight[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Group by month to see month-over-month trends
  const monthlyAverages: Record<string, number> = {};
  
  for (const item of environmentalData) {
    const monthStr = item.month.substring(0, 7); // YYYY-MM
    if (!monthlyAverages[monthStr]) {
      monthlyAverages[monthStr] = 0;
      monthlyAverages[`${monthStr}_count`] = 0;
    }
    
    monthlyAverages[monthStr] += item.average_value;
    monthlyAverages[`${monthStr}_count`]++;
  }
  
  // Calculate actual averages
  const monthsInOrder: string[] = [];
  for (const monthStr in monthlyAverages) {
    if (!monthStr.includes('_count')) {
      monthsInOrder.push(monthStr);
      monthlyAverages[monthStr] /= monthlyAverages[`${monthStr}_count`];
    }
  }
  
  // Sort months chronologically
  monthsInOrder.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  // If we have at least 3 months of data, detect trends
  if (monthsInOrder.length >= 3) {
    const latestMonth = monthsInOrder[0];
    const previousMonth = monthsInOrder[1];
    const thirdMonth = monthsInOrder[2];
    
    const latestAvg = monthlyAverages[latestMonth];
    const previousAvg = monthlyAverages[previousMonth];
    const thirdAvg = monthlyAverages[thirdMonth];
    
    // Check for consistent improvement over 3 months
    if (latestAvg > previousAvg && previousAvg > thirdAvg) {
      const percentChange = ((latestAvg - previousAvg) / previousAvg) * 100;
      insights.push({
        userId: environmentalData[0].user_id,
        type: 'trend',
        title: 'Consistent environmental improvement',
        description: `Your environmental metrics have improved consistently over the last 3 months, with a ${percentChange.toFixed(1)}% improvement in the latest month.`,
        indicator: 'up',
        percentageChange: parseFloat(percentChange.toFixed(1)),
        date: today,
        category: 'environmental',
        priority: 'high',
        relatedMetrics: ['environmental_score', 'energy_efficiency']
      });
    }
    
    // Check for significant month-over-month change
    if (Math.abs(latestAvg - previousAvg) / previousAvg > 0.15) { // 15% change
      const percentChange = ((latestAvg - previousAvg) / previousAvg) * 100;
      const improving = latestAvg > previousAvg;
      
      insights.push({
        userId: environmentalData[0].user_id,
        type: 'trend',
        title: `Environmental performance ${improving ? 'spike' : 'decline'}`,
        description: `Your environmental metrics have ${improving ? 'improved' : 'declined'} by ${Math.abs(percentChange).toFixed(1)}% compared to the previous month, which is a significant change.`,
        indicator: improving ? 'up' : 'down',
        percentageChange: parseFloat(percentChange.toFixed(1)),
        date: today,
        category: 'environmental',
        priority: improving ? 'medium' : 'high'
      });
    }
  }
  
  return insights;
}

// Detect carbon emission trends using advanced algorithms
function detectCarbonTrends(carbonData: any[]): ESGInsight[] {
  const insights: ESGInsight[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Group by scope
  const byScope: Record<string, any[]> = {};
  for (const item of carbonData) {
    if (!byScope[item.scope]) {
      byScope[item.scope] = [];
    }
    byScope[item.scope].push(item);
  }
  
  // Analyze each scope
  for (const scope in byScope) {
    const scopeData = byScope[scope].sort((a, b) => 
      new Date(b.month).getTime() - new Date(a.month).getTime());
    
    if (scopeData.length < 2) continue;
    
    const current = scopeData[0];
    const previous = scopeData[1];
    
    const percentChange = ((current.total_emissions - previous.total_emissions) / previous.total_emissions) * 100;
    
    // Only report significant changes (>5%)
    if (Math.abs(percentChange) > 5) {
      const isImprovement = percentChange < 0;
      
      insights.push({
        userId: current.user_id,
        type: isImprovement ? 'trend' : 'alert',
        title: `${scope} emissions ${isImprovement ? 'decreasing' : 'increasing'}`,
        description: `Your ${scope} carbon emissions have ${isImprovement ? 'decreased' : 'increased'} by ${Math.abs(percentChange).toFixed(1)}% compared to the previous month.`,
        indicator: isImprovement ? 'down' : 'up',
        percentageChange: parseFloat(percentChange.toFixed(1)),
        date: today,
        category: 'environmental',
        priority: isImprovement ? 'medium' : 'high',
        relatedMetrics: ['carbon_footprint', `${scope.toLowerCase()}_emissions`]
      });
    }
  }
  
  return insights;
}

// Generate carbon emission reduction recommendations
function generateCarbonRecommendations(carbonData: any[]): ESGInsight[] {
  const insights: ESGInsight[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Group by scope to find highest emitting scope
  const scopeEmissions: Record<string, number> = {};
  let userId = '';
  
  for (const item of carbonData) {
    if (!userId) userId = item.user_id;
    
    if (!scopeEmissions[item.scope]) {
      scopeEmissions[item.scope] = 0;
    }
    scopeEmissions[item.scope] += item.total_emissions;
  }
  
  // Find highest emitting scope
  let highestScope = '';
  let highestEmissions = 0;
  
  for (const scope in scopeEmissions) {
    if (scopeEmissions[scope] > highestEmissions) {
      highestScope = scope;
      highestEmissions = scopeEmissions[scope];
    }
  }
  
  // Generate recommendation based on highest emissions
  if (highestScope) {
    const scopeLabel = highestScope.toLowerCase().includes('scope') ? 
      highestScope : `Scope ${highestScope}`;
    
    let recommendationTitle = '';
    let recommendationDesc = '';
    
    switch (scopeLabel) {
      case 'Scope 1':
        recommendationTitle = 'Direct emissions reduction opportunity';
        recommendationDesc = 'Based on your emissions profile, implementing energy efficiency measures in your facilities could reduce your Scope 1 emissions by an estimated 15-20%.';
        break;
      case 'Scope 2':
        recommendationTitle = 'Renewable energy opportunity';
        recommendationDesc = 'Switching to renewable energy sources for your operations could significantly reduce your Scope 2 emissions and potentially save on energy costs long-term.';
        break;
      default: // Scope 3 or other
        recommendationTitle = 'Supply chain emissions reduction';
        recommendationDesc = 'Your value chain represents a significant portion of your carbon footprint. Consider engaging key suppliers on emissions reduction initiatives.';
    }
    
    insights.push({
      userId,
      type: 'recommendation',
      title: recommendationTitle,
      description: recommendationDesc,
      date: today,
      category: 'environmental',
      priority: 'high',
      actionable: true,
      relatedMetrics: ['carbon_footprint', `${scopeLabel.toLowerCase()}_emissions`]
    });
  }
  
  return insights;
}

// Analyze compliance risks in the data
function analyzeComplianceRisks(complianceData: any[], userId: string, today: string): ESGInsight[] {
  const insights: ESGInsight[] = [];
  
  // Count non-compliant frameworks
  const nonCompliantFrameworks = complianceData.filter(
    item => item.status === 'non-compliant' || item.status === 'at-risk'
  );
  
  if (nonCompliantFrameworks.length > 0) {
    // List the non-compliant frameworks
    const frameworkNames = nonCompliantFrameworks
      .map(item => item.compliance_frameworks?.name || 'Unknown framework')
      .filter((value, index, self) => self.indexOf(value) === index) // unique values
      .slice(0, 3) // Top 3
      .join(', ');
    
    insights.push({
      userId,
      type: 'alert',
      title: 'Compliance risks detected',
      description: `You have ${nonCompliantFrameworks.length} compliance frameworks at risk, including ${frameworkNames}. Addressing these should be prioritized to avoid regulatory issues.`,
      date: today,
      category: 'governance',
      priority: 'high',
      actionable: true
    });
  } else if (complianceData.length > 0) {
    // If compliant, add a positive insight
    insights.push({
      userId,
      type: 'info',
      title: 'Strong compliance status',
      description: 'Your organization is currently compliant with all tracked regulatory frameworks. Consider expanding compliance monitoring to additional relevant frameworks.',
      date: today,
      category: 'governance',
      priority: 'low'
    });
  }
  
  return insights;
}

// Prioritize insights based on relevance and actionability
function prioritizeInsights(insights: ESGInsight[]): ESGInsight[] {
  // Sort by priority and actionability
  return insights.sort((a, b) => {
    // High priority first
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aPriority = priorityOrder[a.priority || 'medium'];
    const bPriority = priorityOrder[b.priority || 'medium'];
    
    if (aPriority !== bPriority) return aPriority - bPriority;
    
    // Actionable items second
    if (a.actionable && !b.actionable) return -1;
    if (!a.actionable && b.actionable) return 1;
    
    // Alerts before other types
    const typeOrder = { alert: 0, trend: 1, recommendation: 2, info: 3 };
    return typeOrder[a.type] - typeOrder[b.type];
  });
}

// Function to generate basic insights (fallback if DeepSeek not available)
function generateBasicInsights(userId: string, esgData: any[], carbonData: any[]): ESGInsight[] {
  const insights: ESGInsight[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Group data by category
  const esgByCategory: Record<string, any[]> = {};
  esgData.forEach(item => {
    if (!esgByCategory[item.category]) {
      esgByCategory[item.category] = [];
    }
    esgByCategory[item.category].push(item);
  });
  
  // Analyze environmental data trends
  if (esgByCategory['environmental'] && esgByCategory['environmental'].length >= 2) {
    const envData = esgByCategory['environmental'].sort((a, b) => 
      new Date(b.month).getTime() - new Date(a.month).getTime()
    );
    
    const current = envData[0];
    const previous = envData[1];
    
    if (current && previous && current.average_value !== previous.average_value) {
      const percentChange = ((current.average_value - previous.average_value) / previous.average_value) * 100;
      const indicator = percentChange > 0 ? 'up' : 'down';
      
      insights.push({
        userId,
        type: 'trend',
        title: `Environmental performance ${indicator === 'up' ? 'increased' : 'decreased'}`,
        description: `Your environmental metrics have ${indicator === 'up' ? 'improved' : 'declined'} by ${Math.abs(percentChange).toFixed(1)}% compared to the previous month.`,
        indicator,
        percentageChange: parseFloat(percentChange.toFixed(1)),
        date: today,
        category: 'environmental'
      });
    }
  }
  
  // Analyze carbon emissions
  if (carbonData && carbonData.length >= 2) {
    const sortedCarbonData = carbonData.sort((a, b) => 
      new Date(b.month).getTime() - new Date(a.month).getTime()
    );
    
    // Group by scope
    const byScope: Record<string, any[]> = {};
    sortedCarbonData.forEach(item => {
      if (!byScope[item.scope]) {
        byScope[item.scope] = [];
      }
      byScope[item.scope].push(item);
    });
    
    // Check for significant changes in each scope
    for (const scope in byScope) {
      if (byScope[scope].length >= 2) {
        const current = byScope[scope][0];
        const previous = byScope[scope][1];
        
        if (current && previous) {
          const percentChange = ((current.total_emissions - previous.total_emissions) / previous.total_emissions) * 100;
          
          if (Math.abs(percentChange) > 10) { // Only show significant changes
            const indicator = percentChange > 0 ? 'up' : 'down';
            
            insights.push({
              userId,
              type: percentChange > 0 ? 'alert' : 'info',
              title: `${scope} emissions ${indicator === 'up' ? 'increased' : 'decreased'} significantly`,
              description: `Your ${scope} carbon emissions have ${indicator === 'up' ? 'increased' : 'decreased'} by ${Math.abs(percentChange).toFixed(1)}% compared to the previous month.`,
              indicator,
              percentageChange: parseFloat(percentChange.toFixed(1)),
              date: today,
              category: 'environmental'
            });
          }
        }
      }
    }
  }
  
  // Add recommendations based on data patterns
  if (carbonData && carbonData.length > 0) {
    insights.push({
      userId,
      type: 'recommendation',
      title: 'Optimization opportunity identified',
      description: 'Based on your carbon emission pattern, implementing energy efficiency measures could reduce your Scope 2 emissions by an estimated 15-20%.',
      date: today,
      category: 'environmental'
    });
  }
  
  // Add regulatory updates/alerts if compliance data is available
  insights.push({
    userId,
    type: 'alert',
    title: 'Upcoming regulatory changes',
    description: 'New ESG reporting requirements will become mandatory in your region by Q1 next year. Ensure your data collection processes are aligned with these changes.',
    date: today,
    category: 'governance'
  });
  
  return insights;
}
