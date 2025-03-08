
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { parse } from "https://deno.land/x/xml@2.1.0/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

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
  },
  {
    name: 'TCFD',
    url: 'https://www.fsb-tcfd.org/news/',
    type: 'web',
    category: 'reporting_framework',
  },
  {
    name: 'CDP',
    url: 'https://www.cdp.net/en/articles/media',
    type: 'web',
    category: 'reporting_framework',
  },
  {
    name: 'UN Global Compact',
    url: 'https://www.unglobalcompact.org/news',
    type: 'web',
    category: 'guidance',
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
      impact_level: calculateImpactLevel(item.title, item.description),
      relevance_score: calculateRelevanceScore(item.title, item.description),
      tags: extractTags(item.title, item.description, item.category),
      country: extractCountry(item.title, item.description)
    }));
  } catch (error) {
    console.error(`Error scraping RSS feed ${source.name}:`, error);
    return [];
  }
}

// Function to scrape web pages using DOM parser
async function scrapeWebPage(source) {
  console.log(`Scraping web page: ${source.url}`);
  
  try {
    const response = await fetch(source.url);
    const html = await response.text();
    
    // Parse the HTML
    const document = new DOMParser().parseFromString(html, "text/html");
    if (!document) throw new Error("Could not parse HTML");
    
    // Extract news items - this is a simplified approach
    // In a real implementation, you'd need site-specific selectors
    const articles = [];
    
    // Look for common article selectors
    const articleElements = document.querySelectorAll("article, .news-item, .post, .article");
    
    if (articleElements && articleElements.length > 0) {
      for (let i = 0; i < Math.min(articleElements.length, 5); i++) { // Limit to 5 articles
        const element = articleElements[i];
        
        // Extract title, link, and content
        const titleEl = element.querySelector("h1, h2, h3, .title");
        const linkEl = element.querySelector("a");
        const contentEl = element.querySelector("p, .summary, .excerpt, .content");
        
        const title = titleEl ? titleEl.textContent.trim() : "No title";
        const link = linkEl ? linkEl.getAttribute("href") : source.url;
        const content = contentEl ? contentEl.textContent.trim() : "No content";
        
        // Normalize link to absolute URL if it's relative
        const fullLink = link?.startsWith("http") ? link : new URL(link || "", source.url).href;
        
        articles.push({
          source: source.name,
          title: title,
          content: content.substring(0, 500) + (content.length > 500 ? '...' : ''), // Truncate
          url: fullLink,
          category: source.category,
          published_date: new Date().toISOString(), // No date available, use current time
          impact_level: calculateImpactLevel(title, content),
          relevance_score: calculateRelevanceScore(title, content),
          tags: extractTags(title, content, source.category),
          country: extractCountry(title, content)
        });
      }
    } else {
      // Fallback if no articles found
      articles.push({
        source: source.name,
        title: `Latest updates from ${source.name}`,
        content: "Visit the website for the latest ESG updates and information.",
        url: source.url,
        category: source.category,
        published_date: new Date().toISOString(),
        impact_level: "medium",
        relevance_score: 0.5,
        tags: [source.category, "esg", "update"],
        country: null
      });
    }
    
    return articles;
  } catch (error) {
    console.error(`Error scraping web page ${source.name}:`, error);
    
    // Return fallback result on error
    return [{
      source: source.name,
      title: `Updates from ${source.name}`,
      content: "Could not retrieve content. Please visit the website directly.",
      url: source.url,
      category: source.category,
      published_date: new Date().toISOString(),
      impact_level: "medium",
      relevance_score: 0.5,
      tags: [source.category],
      country: null
    }];
  }
}

// Calculate impact level based on keywords
function calculateImpactLevel(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  
  const highImpactTerms = ['urgent', 'critical', 'mandatory', 'regulation', 'law', 'compliance', 'deadline', 'penalty', 'fine'];
  const mediumImpactTerms = ['important', 'update', 'change', 'new standard', 'requirement'];
  
  let highMatches = 0;
  let mediumMatches = 0;
  
  highImpactTerms.forEach(term => {
    if (text.includes(term)) highMatches++;
  });
  
  mediumImpactTerms.forEach(term => {
    if (text.includes(term)) mediumMatches++;
  });
  
  if (highMatches >= 2) return 'high';
  if (highMatches >= 1 || mediumMatches >= 2) return 'medium';
  return 'low';
}

// Calculate relevance score based on ESG keywords
function calculateRelevanceScore(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  
  const esgKeywords = [
    'esg', 'sustainability', 'sustainable', 'environment', 'environmental', 
    'social', 'governance', 'carbon', 'emission', 'climate', 'green', 
    'renewable', 'reporting', 'disclosure', 'compliance', 'regulation',
    'framework', 'standard', 'guideline', 'metric', 'target', 'goal',
    'sdg', 'net zero', 'ghg', 'greenhouse', 'biodiversity'
  ];
  
  let matches = 0;
  esgKeywords.forEach(keyword => {
    if (text.includes(keyword)) matches++;
  });
  
  // Calculate score from 0 to 1
  return Math.min(1, matches / 8); // max out at 8 matches
}

// Extract tags from content
function extractTags(title, content, category) {
  const text = `${title} ${content}`.toLowerCase();
  const tags = [];
  
  // Add category as a tag
  if (category) tags.push(category);
  
  // Check for ESG pillar tags
  if (text.match(/environment|climate|emission|carbon|pollution|energy|water|waste/)) {
    tags.push('environmental');
  }
  
  if (text.match(/social|community|employee|diversity|inclusion|human right|labor/)) {
    tags.push('social');
  }
  
  if (text.match(/governance|board|executive|compliance|ethics|transparency|anti-corruption/)) {
    tags.push('governance');
  }
  
  // Check for regulation/reporting tags
  if (text.match(/regulation|law|directive|act|policy/)) {
    tags.push('regulation');
  }
  
  if (text.match(/reporting|disclosure|standard|framework|guideline/)) {
    tags.push('reporting');
  }
  
  return [...new Set(tags)]; // Remove duplicates
}

// Extract country references
function extractCountry(title, content) {
  const text = `${title} ${content}`;
  
  const countries = ['EU', 'Europe', 'European Union', 'US', 'USA', 'United States', 
                     'UK', 'United Kingdom', 'China', 'Japan', 'Canada', 'Australia', 
                     'India', 'Brazil', 'Germany', 'France', 'Italy', 'Spain'];
  
  for (const country of countries) {
    const regex = new RegExp(`\\b${country}\\b`, 'i');
    if (text.match(regex)) {
      return country;
    }
  }
  
  return null;
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
