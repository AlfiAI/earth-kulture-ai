
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "../esg-scraper/utils.ts";

interface ESGIntelligenceSource {
  name: string;
  category: string;
  url: string;
  priority: 'high' | 'medium' | 'low';
  lastUpdated?: string;
}

interface ESGIntelligenceItem {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: string;
  relevanceScore: number; // 0-100
  publishDate: string;
  topics: string[];
  regions: string[];
  industries: string[];
}

// Cross-Origin Resource Sharing headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Parse request
    const { industry, region, category, limit = 20 } = await req.json();
    
    console.log(`Processing ESG intelligence request for industry: ${industry}, region: ${region}, category: ${category}`);
    
    // Define intelligence sources
    const sources: ESGIntelligenceSource[] = [
      {
        name: "EU Sustainability Database",
        category: "regulatory",
        url: "https://ec.europa.eu/environment/ecoap/indicators/index_en",
        priority: "high",
      },
      {
        name: "CDP Climate Change Data",
        category: "climate",
        url: "https://www.cdp.net/en/data",
        priority: "high",
      },
      {
        name: "MSCI ESG Research",
        category: "ratings",
        url: "https://www.msci.com/our-solutions/esg-investing/esg-ratings",
        priority: "medium",
      },
      {
        name: "S&P Global ESG Scores",
        category: "ratings",
        url: "https://www.spglobal.com/esg/scores/",
        priority: "medium",
      },
      {
        name: "SASB Standards",
        category: "frameworks",
        url: "https://www.sasb.org/standards/",
        priority: "high",
      },
      {
        name: "GRI Standards",
        category: "frameworks",
        url: "https://www.globalreporting.org/standards/",
        priority: "high",
      },
      {
        name: "UN Sustainable Development Goals",
        category: "goals",
        url: "https://sdgs.un.org/goals",
        priority: "medium",
      },
      {
        name: "Bloomberg ESG Data",
        category: "market",
        url: "https://www.bloomberg.com/professional/solution/sustainable-finance/",
        priority: "medium",
      },
      {
        name: "World Bank Climate Change Data",
        category: "climate",
        url: "https://climateknowledgeportal.worldbank.org/",
        priority: "medium",
      },
      {
        name: "TCFD Knowledge Hub",
        category: "frameworks",
        url: "https://www.tcfdhub.org/",
        priority: "high",
      }
    ];
    
    // Filter sources by category if specified
    const filteredSources = category 
      ? sources.filter(s => s.category === category) 
      : sources;
    
    // For demo purposes, we're generating mock intelligence data
    // In a real implementation, this would use web scraping or API calls to the sources
    const generateMockIntelligence = (source: ESGIntelligenceSource, targetIndustry?: string, targetRegion?: string): ESGIntelligenceItem[] => {
      // Generate a consistent number of items based on the source name
      const itemCount = (source.name.length % 3) + 1;
      const items: ESGIntelligenceItem[] = [];
      
      for (let i = 0; i < itemCount; i++) {
        // Generate a publish date within the last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const publishDate = new Date();
        publishDate.setDate(publishDate.getDate() - daysAgo);
        
        // Determine if this item is relevant to the requested filters
        const isIndustryRelevant = !targetIndustry || Math.random() > 0.3;
        const isRegionRelevant = !targetRegion || Math.random() > 0.3;
        
        // Only include if relevant to both industry and region (when specified)
        if (isIndustryRelevant && isRegionRelevant) {
          const mockTopics = ["emissions", "climate finance", "biodiversity", "water security", "circular economy"];
          const mockRegions = ["EU", "North America", "Asia Pacific", "Global", "UK"];
          const mockIndustries = ["energy", "technology", "manufacturing", "financial", "healthcare"];
          
          // Create a more specific title based on source category
          let title = "";
          switch (source.category) {
            case "regulatory":
              title = `New ${Math.random() > 0.5 ? "EU" : "Global"} regulation impacts ${targetIndustry || "industries"} on ${mockTopics[Math.floor(Math.random() * mockTopics.length)]}`;
              break;
            case "climate":
              title = `Climate data shows ${Math.random() > 0.5 ? "concerning" : "improving"} trends for ${targetIndustry || "industries"}`;
              break;
            case "ratings":
              title = `ESG ratings ${Math.random() > 0.5 ? "upgraded" : "adjusted"} for leading ${targetIndustry || "companies"}`;
              break;
            case "frameworks":
              title = `${source.name.split(" ")[0]} updates reporting requirements for ${mockTopics[Math.floor(Math.random() * mockTopics.length)]}`;
              break;
            default:
              title = `${source.name} releases new data on ${mockTopics[Math.floor(Math.random() * mockTopics.length)]}`;
          }
          
          items.push({
            title,
            summary: `New information from ${source.name} provides insights on ${mockTopics[Math.floor(Math.random() * mockTopics.length)]} for ${targetIndustry || "industries"} in ${targetRegion || mockRegions[Math.floor(Math.random() * mockRegions.length)]}.`,
            source: source.name,
            sourceUrl: source.url,
            category: source.category,
            relevanceScore: Math.floor(Math.random() * 40) + 60, // 60-100 range
            publishDate: publishDate.toISOString(),
            topics: mockTopics.slice(0, Math.floor(Math.random() * 3) + 1),
            regions: targetRegion ? [targetRegion] : mockRegions.slice(0, Math.floor(Math.random() * 3) + 1),
            industries: targetIndustry ? [targetIndustry] : mockIndustries.slice(0, Math.floor(Math.random() * 3) + 1)
          });
        }
      }
      
      return items;
    };
    
    // Generate intelligence items from all filtered sources
    let intelligenceItems: ESGIntelligenceItem[] = [];
    
    for (const source of filteredSources) {
      const items = generateMockIntelligence(source, industry, region);
      intelligenceItems = [...intelligenceItems, ...items];
    }
    
    // Sort by relevance score and limit results
    intelligenceItems.sort((a, b) => b.relevanceScore - a.relevanceScore);
    intelligenceItems = intelligenceItems.slice(0, limit);
    
    // Store intelligence data for future reference
    await supabase.from('esg_intelligence_cache').upsert(
      intelligenceItems.map(item => ({
        title: item.title,
        summary: item.summary,
        source: item.source,
        source_url: item.sourceUrl,
        category: item.category,
        relevance_score: item.relevanceScore,
        publish_date: item.publishDate,
        topics: item.topics,
        regions: item.regions,
        industries: item.industries,
        cached_at: new Date().toISOString()
      }))
    );
    
    // Return the intelligence items
    return new Response(
      JSON.stringify({
        success: true,
        data: intelligenceItems,
        count: intelligenceItems.length,
        sources: filteredSources.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Error in ESG intelligence aggregator:", error);
    
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
