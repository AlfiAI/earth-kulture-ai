
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { parse } from "https://deno.land/x/xml@2.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sources for ESG data
const ESG_SOURCES = [
  {
    name: 'GRI',
    url: 'https://www.globalreporting.org/news/media-center/',
    type: 'rss',
    category: 'reporting_framework',
  },
  {
    name: 'SASB',
    url: 'https://www.sasb.org/news/',
    type: 'web',
    category: 'reporting_framework',
  },
  {
    name: 'EU Taxonomy',
    url: 'https://ec.europa.eu/info/business-economy-euro/banking-and-finance/sustainable-finance/eu-taxonomy-sustainable-activities_en',
    type: 'web',
    category: 'regulation',
  }
];

// Function to scrape RSS feeds
async function scrapeRssFeed(source) {
  console.log(`Scraping RSS feed: ${source.url}`);
  
  try {
    const response = await fetch(source.url);
    const xmlText = await response.text();
    const feed = parse(xmlText);
    
    // Extract items from RSS feed
    const items = feed.rss?.channel?.item || [];
    return items.map(item => ({
      source: source.name,
      title: item.title || 'No title',
      content: item.description || item['content:encoded'] || 'No content',
      url: item.link || source.url,
      category: source.category,
      published_date: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      impact_level: 'medium', // Default impact level
      relevance_score: 0.75, // Default relevance score
      tags: []
    }));
  } catch (error) {
    console.error(`Error scraping RSS feed ${source.name}:`, error);
    return [];
  }
}

// Function to scrape web pages using regular expressions (a simple approach)
async function scrapeWebPage(source) {
  console.log(`Scraping web page: ${source.url}`);
  
  try {
    const response = await fetch(source.url);
    const html = await response.text();
    
    // Simple extraction of title and content using regex
    // In a production environment, you might use a more robust parser
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'No title';
    
    // Extract text content (simple approach)
    let content = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    content = content.substring(0, 1000) + '...'; // Truncate for demo
    
    return [{
      source: source.name,
      title: title,
      content: content,
      url: source.url,
      category: source.category,
      published_date: new Date().toISOString(),
      impact_level: 'medium',
      relevance_score: 0.5,
      tags: []
    }];
  } catch (error) {
    console.error(`Error scraping web page ${source.name}:`, error);
    return [];
  }
}

// Main function to scrape all sources
async function scrapeAllSources() {
  console.log("Starting to scrape all ESG sources");
  
  const allResults = [];
  
  for (const source of ESG_SOURCES) {
    try {
      let results = [];
      
      if (source.type === 'rss') {
        results = await scrapeRssFeed(source);
      } else if (source.type === 'web') {
        results = await scrapeWebPage(source);
      }
      
      allResults.push(...results);
    } catch (error) {
      console.error(`Error processing source ${source.name}:`, error);
    }
  }
  
  return allResults;
}

// Store scraped data in the database
async function storeScrapedData(results) {
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

// Create Supabase client
function createClient(supabaseUrl, supabaseKey) {
  return {
    from: (table) => ({
      upsert: (data, options) => {
        return fetch(`${supabaseUrl}/rest/v1/${table}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Prefer': options?.onConflict ? `resolution=merge-duplicates,duplicate-columns=${options.onConflict}` : '',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify(data)
        }).then(res => res.json())
          .then(data => ({ data, error: null }))
          .catch(error => ({ data: null, error }));
      }
    })
  };
}

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
