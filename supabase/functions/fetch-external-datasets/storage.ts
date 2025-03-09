
import { createClient } from "./utils.ts";

// Store fetched data in the database
export async function storeExternalData(results: any[]) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase credentials");
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  // Enrich data with quality scores before storing
  const enrichedResults = results.map(result => {
    return {
      ...result,
      quality_score: calculateDataQualityScore(result),
      completeness_score: calculateCompletenessScore(result),
      last_verified: new Date().toISOString()
    };
  });
  
  // Insert data into the external_esg_datasets table
  const { data, error } = await supabase
    .from('external_esg_datasets')
    .upsert(enrichedResults, { 
      onConflict: 'source,dataset_name',
      ignoreDuplicates: false // Update existing records
    });
    
  if (error) {
    console.error("Error storing external data:", error);
    throw error;
  }
  
  console.log(`Successfully stored ${enrichedResults.length} ESG datasets`);
  
  return { inserted: enrichedResults.length, data };
}

// Calculate data quality score based on source, completeness, etc.
function calculateDataQualityScore(dataset: any): number {
  let score = 0.5; // Default score
  
  // Higher score for well-known sources
  const reliableSources = ['World Bank', 'OECD', 'UN', 'EPA', 'IPCC', 'Climate Watch'];
  if (reliableSources.some(source => dataset.source.includes(source))) {
    score += 0.2;
  }
  
  // Check if there was an error in processing
  if (dataset.data && dataset.data.error) {
    score -= 0.3;
  }
  
  // Check if the data has meaningful results
  if (dataset.data && dataset.data.processed && dataset.data.processed.length > 5) {
    score += 0.1;
  }
  
  // Check if metadata exists and is complete
  if (dataset.data && dataset.data.metadata && dataset.data.metadata.count > 0) {
    score += 0.1;
  }
  
  // Ensure score is between 0 and 1
  return Math.max(0, Math.min(1, score));
}

// Calculate how complete the dataset is
function calculateCompletenessScore(dataset: any): number {
  if (!dataset.data || !dataset.data.processed) {
    return 0;
  }
  
  const processed = dataset.data.processed;
  
  if (!Array.isArray(processed) || processed.length === 0) {
    return 0;
  }
  
  // Check for required fields in each data point
  const requiredFields = ['indicator', 'value', 'year'];
  let completenessSum = 0;
  
  processed.forEach((item: any) => {
    let itemCompleteness = 0;
    requiredFields.forEach(field => {
      if (item[field] !== undefined && item[field] !== null) {
        itemCompleteness++;
      }
    });
    completenessSum += itemCompleteness / requiredFields.length;
  });
  
  // Calculate average completeness (0 to 1)
  return completenessSum / processed.length;
}
