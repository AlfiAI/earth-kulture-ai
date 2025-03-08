
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { fetchFromSources } from "./sources.ts";
import { storeExternalData } from "./storage.ts";
import { corsHeaders } from "./utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Fetching external ESG datasets");
    
    // Fetch data from all sources
    const fetchedData = await fetchFromSources();
    
    console.log(`Fetched ${fetchedData.length} datasets`);
    
    // Store data in the database
    const result = await storeExternalData(fetchedData);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully fetched and stored ${result.inserted} ESG datasets`,
        count: fetchedData.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in fetch-external-datasets function:", error);
    
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
