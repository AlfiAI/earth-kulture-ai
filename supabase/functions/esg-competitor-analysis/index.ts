
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ESGCompetitorData {
  id: string;
  company_name: string;
  industry: string;
  esg_score: number;
  environmental_score: number;
  social_score: number;
  governance_score: number;
  report_year: number;
  report_url?: string;
  highlights?: string[];
}

// Track active crawls to prevent duplicates
const activeCrawls = new Map<string, boolean>();

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
    
    // Get request data
    const requestData = await req.json();
    const { companyUrl, industry, userId } = requestData;
    
    if (!companyUrl) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing company URL" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    // Check if we already have a crawl in progress for this URL
    if (activeCrawls.has(companyUrl)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Analysis already in progress for this URL" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 409 
        }
      );
    }
    
    // Mark this URL as being processed
    activeCrawls.set(companyUrl, true);
    
    try {
      console.log(`Starting ESG analysis for: ${companyUrl}`);
      
      // For demo purposes, return mock data
      // In a real implementation, this would use a web crawler service like Apify
      // and NLP models to extract ESG data from company websites and reports
      
      // Simulate processing time for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock competitor data
      const mockData: ESGCompetitorData = {
        id: crypto.randomUUID(),
        company_name: `Company from ${new URL(companyUrl).hostname}`,
        industry: industry || "Technology",
        esg_score: Math.floor(Math.random() * 30) + 60, // 60-90 range
        environmental_score: Math.floor(Math.random() * 30) + 60,
        social_score: Math.floor(Math.random() * 30) + 60,
        governance_score: Math.floor(Math.random() * 30) + 60,
        report_year: new Date().getFullYear(),
        report_url: `${companyUrl}/sustainability`,
        highlights: [
          "Carbon reduction initiatives",
          "Diversity and inclusion programs",
          "Transparent governance reporting"
        ]
      };
      
      // Store the competitor data
      const { data, error } = await supabaseClient
        .from('esg_competitors')
        .insert(mockData)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Create a job record for tracking
      if (userId) {
        await supabaseClient
          .from('competitor_analysis_jobs')
          .insert({
            user_id: userId,
            company_url: companyUrl,
            status: 'completed',
            competitor_id: data.id
          });
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } finally {
      // Clean up the active crawl marker
      activeCrawls.delete(companyUrl);
    }
  } catch (error) {
    console.error("Error analyzing competitor ESG data:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to analyze competitor ESG data" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
