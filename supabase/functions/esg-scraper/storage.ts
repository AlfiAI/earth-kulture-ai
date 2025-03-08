
import { createClient } from "./utils.ts";

// Store scraped data in the database
export async function storeScrapedData(results: any[]) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase credentials");
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  // Insert data into the esg_regulatory_updates table
  const { data, error } = await supabase
    .from('esg_regulatory_updates')
    .upsert(results, { 
      onConflict: 'source,title',
      ignoreDuplicates: true 
    });
    
  if (error) {
    console.error("Error storing scraped data:", error);
    throw error;
  }
  
  return { inserted: results.length, data };
}
