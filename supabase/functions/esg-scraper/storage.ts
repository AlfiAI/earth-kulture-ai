
import { createClient } from "./utils.ts";

// Store scraped data in the database
export async function storeScrapedData(results: any[]) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase credentials");
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  // Enrich data with AI sentiment analysis before storing
  const enrichedResults = results.map(result => {
    // Add sentiment analysis (this would typically be implemented with a real NLP service)
    const sentiment = analyzeSentiment(result.title, result.content);
    const credibility = calculateCredibilityScore(result.source);
    const importance = calculateImportanceScore(result.impact_level);
    
    return {
      ...result,
      ai_sentiment: sentiment,
      credibility_score: credibility,
      importance_score: importance,
      // Add timestamp
      scraped_at: new Date().toISOString()
    };
  });
  
  // Insert data into the esg_regulatory_updates table
  const { data, error } = await supabase
    .from('esg_regulatory_updates')
    .upsert(enrichedResults, { 
      onConflict: 'source,title',
      ignoreDuplicates: true 
    });
    
  if (error) {
    console.error("Error storing scraped data:", error);
    throw error;
  }
  
  console.log(`Successfully stored ${enrichedResults.length} ESG updates`);
  
  return { inserted: enrichedResults.length, data };
}

// Simple sentiment analysis function
function analyzeSentiment(title: string = '', content: string = ''): { sentiment: string, score: number } {
  const text = (title + ' ' + content).toLowerCase();
  
  const positiveWords = ['improvement', 'advance', 'sustainable', 'green', 'progress', 'benefit', 'positive', 'success'];
  const negativeWords = ['risk', 'penalty', 'fine', 'violation', 'concern', 'fail', 'challenge', 'problem'];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (text.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (text.includes(word)) negativeScore++;
  });
  
  const totalScore = positiveScore - negativeScore;
  let sentiment = 'neutral';
  
  if (totalScore > 1) sentiment = 'positive';
  else if (totalScore < -1) sentiment = 'negative';
  
  return {
    sentiment,
    score: totalScore
  };
}

// Calculate credibility score based on source
function calculateCredibilityScore(source: string): number {
  const highCredibilitySources = ['SEC', 'EU', 'TCFD', 'SASB', 'GRI', 'CDP', 'UN Global Compact', 'World Bank', 'IPCC'];
  const mediumCredibilitySources = ['Bloomberg', 'Reuters', 'Financial Times', 'Sustainalytics', 'MSCI'];
  
  // Scale from 0 to 1
  if (highCredibilitySources.some(s => source.includes(s))) {
    return 0.9; // High credibility
  } else if (mediumCredibilitySources.some(s => source.includes(s))) {
    return 0.7; // Medium credibility
  } else {
    return 0.5; // Default credibility
  }
}

// Calculate importance score based on impact level
function calculateImportanceScore(impactLevel: string = 'medium'): number {
  switch (impactLevel) {
    case 'high':
      return 0.9;
    case 'medium':
      return 0.6;
    case 'low':
      return 0.3;
    default:
      return 0.5;
  }
}
