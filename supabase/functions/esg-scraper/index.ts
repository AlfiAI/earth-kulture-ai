
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { scrapeAllSources } from "./scrapers.ts";
import { storeScrapedData } from "./storage.ts";
import { corsHeaders } from "./utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("ESG Scraper function triggered");
    
    // Scrape data from all sources
    const scrapedData = await scrapeAllSources();
    console.log(`Scraped ${scrapedData.length} items`);
    
    // Store data in the database
    const result = await storeScrapedData(scrapedData);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped and stored ${result.inserted} ESG updates`,
        count: scrapedData.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in ESG scraper function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
