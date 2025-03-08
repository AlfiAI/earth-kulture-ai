
import { parse } from "https://deno.land/x/xml@2.1.0/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { ESG_SOURCES } from "./sources.ts";
import { 
  calculateImpactLevel, 
  calculateRelevanceScore, 
  extractTags, 
  extractCountry 
} from "./utils.ts";

// Function to scrape RSS feeds
async function scrapeRssFeed(source: any) {
  console.log(`Scraping RSS feed: ${source.url}`);
  
  try {
    const response = await fetch(source.url);
    const xmlText = await response.text();
    const feed = parse(xmlText);
    
    // Extract items from RSS feed
    const items = feed.rss?.channel?.item || [];
    return items.map((item: any) => ({
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
async function scrapeWebPage(source: any) {
  console.log(`Scraping web page: ${source.url}`);
  
  try {
    const response = await fetch(source.url);
    const html = await response.text();
    
    // Parse the HTML
    const document = new DOMParser().parseFromString(html, "text/html");
    if (!document) throw new Error("Could not parse HTML");
    
    // Extract news items - this is a simplified approach
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

// Main function to scrape all sources
export async function scrapeAllSources() {
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
