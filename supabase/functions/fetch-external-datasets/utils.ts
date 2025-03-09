
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// CORS headers for edge functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create Supabase client for storing data
export const createClient = (supabaseUrl: string, supabaseKey: string) => {
  return createClient(supabaseUrl, supabaseKey);
};

// Helper function to handle API requests with rate limiting
export async function fetchWithRateLimit(url: string, options: RequestInit = {}, retries = 3, retryDelay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Add a small random delay to respect rate limits
      if (attempt > 1) {
        const jitter = Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt - 1) + jitter));
      }
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'User-Agent': 'Earth Kulture ESG Data Collector/1.0'
        }
      });
      
      if (response.status === 429) { // Too Many Requests
        console.log(`Rate limited (attempt ${attempt}/${retries}). Retrying after delay...`);
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      if (attempt === retries) {
        throw error; // Rethrow if this was the last attempt
      }
      console.error(`Error fetching data (attempt ${attempt}/${retries}):`, error);
    }
  }
  
  throw new Error(`Failed after ${retries} attempts`);
}

// Check if URL is allowed by robots.txt
export async function isAllowedByRobotsTxt(url: string) {
  try {
    const parsedUrl = new URL(url);
    const robotsUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}/robots.txt`;
    
    const response = await fetch(robotsUrl);
    if (!response.ok) {
      // If no robots.txt or can't access, proceed with caution
      return true;
    }
    
    const robotsTxt = await response.text();
    const path = parsedUrl.pathname;
    
    // Simple robots.txt parsing (a basic implementation)
    const lines = robotsTxt.split('\n');
    let userAgentSection = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim().toLowerCase();
      
      if (trimmedLine.startsWith('user-agent:')) {
        const agent = trimmedLine.slice('user-agent:'.length).trim();
        userAgentSection = (agent === '*' || agent === 'earth kulture');
      } else if (userAgentSection && trimmedLine.startsWith('disallow:')) {
        const disallowedPath = trimmedLine.slice('disallow:'.length).trim();
        if (disallowedPath && path.startsWith(disallowedPath)) {
          return false; // Path is disallowed
        }
      }
    }
    
    return true; // No matching disallow rule found
  } catch (error) {
    console.error('Error checking robots.txt:', error);
    return true; // Proceed with caution on error
  }
}
