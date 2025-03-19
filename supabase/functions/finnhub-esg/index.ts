
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { query } = await req.json();
    
    console.log(`Searching for ESG data for: ${query}`);
    
    // In a production implementation, this would use the actual Finnhub API
    // const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY');
    
    // Determine if query is a ticker or company name
    const isTicker = /^[A-Z]{1,5}$/.test(query);
    const searchTerm = isTicker ? query : findTickerByName(query);
    
    if (!searchTerm) {
      return new Response(
        JSON.stringify({ error: "Company not found" }),
        { 
          status: 404, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    // Add a slight delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // For demonstration, return mock data for any query
    // In a real app, this would query the Finnhub API
    const companyData = getMockCompanyData(searchTerm);
    const industryComparison = getMockIndustryComparison(companyData.industry);
    
    return new Response(
      JSON.stringify({
        company: companyData,
        industryComparison
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in finnhub-esg function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Mock company database for demonstration
const companyDatabase = {
  'AAPL': { name: 'Apple Inc.', industry: 'Technology' },
  'MSFT': { name: 'Microsoft Corporation', industry: 'Technology' },
  'AMZN': { name: 'Amazon.com Inc.', industry: 'Consumer Cyclical' },
  'GOOGL': { name: 'Alphabet Inc.', industry: 'Technology' },
  'META': { name: 'Meta Platforms Inc.', industry: 'Technology' },
  'TSLA': { name: 'Tesla Inc.', industry: 'Automotive' },
  'WMT': { name: 'Walmart Inc.', industry: 'Consumer Defensive' },
  'JPM': { name: 'JPMorgan Chase & Co.', industry: 'Financial Services' },
  'BAC': { name: 'Bank of America Corp.', industry: 'Financial Services' },
  'JNJ': { name: 'Johnson & Johnson', industry: 'Healthcare' },
  'PG': { name: 'Procter & Gamble Co.', industry: 'Consumer Defensive' },
  'XOM': { name: 'Exxon Mobil Corporation', industry: 'Energy' },
  'CVX': { name: 'Chevron Corporation', industry: 'Energy' }
};

// Helper function to find ticker by company name (simplified)
function findTickerByName(companyName: string): string | null {
  const lowerCaseName = companyName.toLowerCase();
  
  for (const [ticker, data] of Object.entries(companyDatabase)) {
    if (data.name.toLowerCase().includes(lowerCaseName)) {
      return ticker;
    }
  }
  
  return null;
}

// Generate mock ESG data for a company
function getMockCompanyData(ticker: string): any {
  const company = companyDatabase[ticker];
  
  if (!company) {
    // If ticker not found, use Apple as default
    return getMockCompanyData('AAPL');
  }
  
  const getRandomScore = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomTrend = () => {
    const trends = ['up', 'down', 'stable'];
    return trends[Math.floor(Math.random() * trends.length)];
  };
  
  // Industry-specific score ranges
  const scoreRanges: Record<string, { min: number, max: number }> = {
    'Technology': { min: 70, max: 90 },
    'Energy': { min: 40, max: 70 },
    'Financial Services': { min: 60, max: 85 },
    'Healthcare': { min: 65, max: 90 },
    'Consumer Defensive': { min: 55, max: 80 },
    'Consumer Cyclical': { min: 50, max: 75 },
    'Automotive': { min: 45, max: 75 }
  };
  
  const range = scoreRanges[company.industry] || { min: 50, max: 80 };
  
  const environmental = getRandomScore(range.min, range.max);
  const social = getRandomScore(range.min, range.max);
  const governance = getRandomScore(range.min, range.max);
  const total = Math.round((environmental + social + governance) / 3);
  
  return {
    name: company.name,
    ticker: ticker,
    industry: company.industry,
    esgScores: {
      total: total,
      environmental: environmental,
      social: social,
      governance: governance,
      totalTrend: getRandomTrend(),
      environmentalTrend: getRandomTrend(),
      socialTrend: getRandomTrend(),
      governanceTrend: getRandomTrend()
    },
    lastUpdated: new Date().toISOString()
  };
}

// Generate mock industry comparison data
function getMockIndustryComparison(industry: string): any {
  // Industry-specific averages
  const industryAverages: Record<string, any> = {
    'Technology': {
      total: 75,
      environmental: 73,
      social: 74,
      governance: 78
    },
    'Energy': {
      total: 58,
      environmental: 52,
      social: 62,
      governance: 60
    },
    'Financial Services': {
      total: 72,
      environmental: 68,
      social: 71,
      governance: 77
    },
    'Healthcare': {
      total: 76,
      environmental: 72,
      social: 78,
      governance: 76
    },
    'Consumer Defensive': {
      total: 67,
      environmental: 65,
      social: 71,
      governance: 65
    },
    'Consumer Cyclical': {
      total: 64,
      environmental: 62,
      social: 68,
      governance: 62
    },
    'Automotive': {
      total: 61,
      environmental: 58,
      social: 62,
      governance: 63
    }
  };
  
  // Top performers by industry
  const topPerformers: Record<string, any> = {
    'Technology': {
      name: 'Microsoft Corporation',
      ticker: 'MSFT',
      total: 86,
      environmental: 88,
      social: 84,
      governance: 86
    },
    'Energy': {
      name: 'NextEra Energy Inc.',
      ticker: 'NEE',
      total: 76,
      environmental: 80,
      social: 72,
      governance: 76
    },
    'Financial Services': {
      name: 'Bank of America Corp.',
      ticker: 'BAC',
      total: 81,
      environmental: 78,
      social: 82,
      governance: 83
    },
    'Healthcare': {
      name: 'Johnson & Johnson',
      ticker: 'JNJ',
      total: 83,
      environmental: 80,
      social: 85,
      governance: 84
    },
    'Consumer Defensive': {
      name: 'Unilever PLC',
      ticker: 'UL',
      total: 82,
      environmental: 85,
      social: 84,
      governance: 77
    },
    'Consumer Cyclical': {
      name: 'Nike Inc.',
      ticker: 'NKE',
      total: 76,
      environmental: 79,
      social: 75,
      governance: 74
    },
    'Automotive': {
      name: 'Tesla Inc.',
      ticker: 'TSLA',
      total: 72,
      environmental: 78,
      social: 65,
      governance: 73
    }
  };
  
  return {
    industryName: industry,
    industryAverage: industryAverages[industry] || industryAverages['Technology'],
    topPerformer: topPerformers[industry] || topPerformers['Technology'],
    peerCount: Math.floor(Math.random() * 30) + 20
  };
}
