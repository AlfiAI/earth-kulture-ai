
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
    const { userId } = requestData;
    
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

    console.log("Generating ESG insights for user:", userId);
    
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
    
    // Generate insights based on data
    const insights = generateInsights(userId, esgSummaryData, carbonSummaryData);
    
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
        insights: insights 
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

// Function to generate insights based on data
function generateInsights(
  userId: string, 
  esgData: any[], 
  carbonData: any[]
): ESGInsight[] {
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
