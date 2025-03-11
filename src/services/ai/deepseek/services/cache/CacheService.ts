
/**
 * CacheService - Handles caching of API responses
 */
import { redisCache } from '@/services/cache/redisCache';
import { hashString } from '../../utils/deepseekUtils';

export class CacheService {
  /**
   * Generate a cache key for a query and conversation context
   */
  generateCacheKey(query: string, conversationContext: any[]): string {
    return `deepseek_${hashString(query + JSON.stringify(conversationContext))}`;
  }
  
  /**
   * Try to get a cached response
   */
  async getCachedResponse(cacheKey: string): Promise<string | null> {
    return await redisCache.get<string>(cacheKey);
  }
  
  /**
   * Cache a response for future use
   */
  async cacheResponse(cacheKey: string, response: string, expiryTimeInSeconds: number = 30 * 60): Promise<void> {
    await redisCache.set(cacheKey, response, expiryTimeInSeconds);
  }
}

export const cacheService = new CacheService();
