
import { createClient } from "./utils.ts";

// Store fetched data in the database
export async function storeExternalData(results: any[]) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase credentials");
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  // Insert data into the external_esg_datasets table
  const { data, error } = await supabase
    .from('external_esg_datasets')
    .upsert(results, { 
      onConflict: 'source,dataset_name',
      ignoreDuplicates: false // Update existing records
    });
    
  if (error) {
    console.error("Error storing external data:", error);
    throw error;
  }
  
  return { inserted: results.length, data };
}
