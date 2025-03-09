
import { CACHE_TTL_MS } from './config.ts';

// In-memory response cache
const responseCache = new Map();

// Generate a cache key based on prompt and context
export function generateCacheKey(prompt: string, sessionId: string): string {
  return `${sessionId}:${prompt}`;
}

// Check if a cached response exists and is valid
export function getCachedResponse(prompt: string, sessionId: string): any {
  const cacheKey = generateCacheKey(prompt, sessionId);
  
  if (responseCache.has(cacheKey)) {
    const cached = responseCache.get(cacheKey);
    
    // Check if cache is still valid
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.response;
    }
    
    // Remove expired cache entry
    responseCache.delete(cacheKey);
  }
  
  return null;
}

// Add response to cache
export function cacheResponse(prompt: string, sessionId: string, response: any): void {
  const cacheKey = generateCacheKey(prompt, sessionId);
  
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now()
  });
}
