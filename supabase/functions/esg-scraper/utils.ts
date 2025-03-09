
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// CORS headers for edge functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function calculateImpactLevel(title: string = '', description: string = ''): 'high' | 'medium' | 'low' {
  const combinedText = (title + ' ' + description).toLowerCase();
  
  // Words indicating high impact
  const highImpactWords = ['mandatory', 'requirement', 'regulation', 'law', 'fine', 'penalty', 'compliance', 'deadline', 'immediate', 'critical', 'urgent'];
  
  // Words indicating medium impact
  const mediumImpactWords = ['update', 'change', 'modify', 'standard', 'recommendation', 'guidance', 'advise', 'propose'];
  
  for (const word of highImpactWords) {
    if (combinedText.includes(word)) return 'high';
  }
  
  for (const word of mediumImpactWords) {
    if (combinedText.includes(word)) return 'medium';
  }
  
  return 'low';
}

export function calculateRelevanceScore(title: string = '', description: string = ''): number {
  const combinedText = (title + ' ' + description).toLowerCase();
  
  // ESG keywords for relevance scoring
  const esgKeywords = {
    high: ['carbon', 'emission', 'climate', 'renewable', 'sustainability', 'greenhouse', 'esg', 'tcfd', 'sasb', 'gri', 'sdg'],
    medium: ['environmental', 'social', 'governance', 'green', 'sustainable', 'ethical', 'responsible', 'energy', 'waste', 'diversity'],
    low: ['report', 'disclosure', 'policy', 'strategy', 'metric', 'target', 'goal', 'initiative', 'risk', 'opportunity']
  };
  
  let score = 0.5; // Default score
  
  // Check for high impact keywords (each adds 0.1)
  for (const keyword of esgKeywords.high) {
    if (combinedText.includes(keyword)) score += 0.1;
  }
  
  // Check for medium impact keywords (each adds 0.05)
  for (const keyword of esgKeywords.medium) {
    if (combinedText.includes(keyword)) score += 0.05;
  }
  
  // Check for low impact keywords (each adds 0.02)
  for (const keyword of esgKeywords.low) {
    if (combinedText.includes(keyword)) score += 0.02;
  }
  
  return Math.min(Math.max(score, 0), 1); // Clamp between 0 and 1
}

export function extractTags(title: string = '', description: string = '', categories: string | string[] = []): string[] {
  const combinedText = (title + ' ' + description).toLowerCase();
  const tags = new Set<string>();
  
  // Common ESG tags
  const tagCategories = {
    environmental: ['carbon', 'emissions', 'climate', 'renewable', 'waste', 'water', 'biodiversity', 'pollution'],
    social: ['diversity', 'inclusion', 'labor', 'human rights', 'community', 'health', 'safety', 'privacy'],
    governance: ['board', 'executive', 'compliance', 'ethics', 'transparency', 'corruption', 'risk', 'policy'],
    frameworks: ['tcfd', 'sasb', 'gri', 'cdp', 'sdg', 'un global compact', 'eu taxonomy'],
    regions: ['eu', 'us', 'uk', 'asia', 'global', 'international', 'america', 'europe']
  };
  
  // Add category as a tag
  if (typeof categories === 'string') {
    tags.add(categories.replace('_', ' '));
  } else if (Array.isArray(categories)) {
    categories.forEach(cat => tags.add(cat.replace('_', ' ')));
  }
  
  // Extract tags from text based on predefined categories
  Object.entries(tagCategories).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (combinedText.includes(keyword)) {
        tags.add(keyword);
        // Also add the category as a tag
        if (!tags.has(category)) {
          tags.add(category);
        }
      }
    });
  });
  
  return Array.from(tags);
}

export function extractCountry(title: string = '', description: string = ''): string | null {
  const combinedText = (title + ' ' + description).toLowerCase();
  
  const countries = {
    'united states': ['us', 'usa', 'united states', 'america'],
    'european union': ['eu', 'european union', 'europe'],
    'united kingdom': ['uk', 'britain', 'united kingdom'],
    'china': ['china', 'chinese'],
    'india': ['india', 'indian'],
    'japan': ['japan', 'japanese'],
    'canada': ['canada', 'canadian'],
    'australia': ['australia', 'australian'],
    'global': ['global', 'worldwide', 'international']
  };
  
  for (const [country, keywords] of Object.entries(countries)) {
    for (const keyword of keywords) {
      if (combinedText.includes(keyword)) {
        return country;
      }
    }
  }
  
  return null;
}

// Create Supabase client
export const createClient = (supabaseUrl: string, supabaseKey: string) => {
  return createClient(supabaseUrl, supabaseKey);
};
