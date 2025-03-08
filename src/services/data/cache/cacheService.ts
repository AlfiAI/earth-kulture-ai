
import { redisCache } from "../../cache/redisCache";
import { ESGDataPoint } from '../../types/esgTypes';

export class CacheService {
  // In-memory cache
  private cache: {
    esgData?: {
      data: ESGDataPoint[];
      timestamp: number;
    }
  } = {};

  // Cache TTL in milliseconds (5 minutes)
  private CACHE_TTL = 5 * 60 * 1000;

  // Check if in-memory cache is valid
  isMemoryCacheValid(): boolean {
    return this.cache.esgData && (Date.now() - this.cache.esgData.timestamp < this.CACHE_TTL);
  }

  // Get data from in-memory cache with pagination
  getFromMemoryCache(page: number, pageSize: number): { data: ESGDataPoint[], count: number } | null {
    if (!this.isMemoryCacheValid()) {
      return null;
    }
    
    console.log("Using in-memory cached ESG data");
    
    // Apply pagination to cached data
    const startIndex = (page - 1) * pageSize;
    const paginatedData = this.cache.esgData!.data.slice(startIndex, startIndex + pageSize);
    
    return {
      data: paginatedData,
      count: this.cache.esgData!.data.length
    };
  }

  // Set data in in-memory cache
  setMemoryCache(data: ESGDataPoint[]): void {
    this.cache.esgData = {
      data,
      timestamp: Date.now()
    };
  }

  // Get Redis cache key for ESG data
  getESGDataCacheKey(page: number, pageSize: number): string {
    return `esg_data_page_${page}_size_${pageSize}`;
  }

  // Get data from Redis cache
  async getFromRedis<T>(key: string): Promise<T | null> {
    return await redisCache.get<T>(key);
  }

  // Set data in Redis cache
  async setInRedis<T>(key: string, data: T, ttlInSeconds = 300): Promise<void> {
    await redisCache.set(key, data, ttlInSeconds);
  }

  // Clear in-memory cache
  clearMemoryCache(): void {
    this.cache = {};
  }

  // Clear Redis cache for ESG data
  async clearRedisCache(): Promise<void> {
    const keys = await redisCache.keys();
    const esgKeys = keys.filter(key => key.startsWith('esg_data_'));
    
    for (const key of esgKeys) {
      await redisCache.delete(key);
    }
  }

  // Clear all caches
  async clearAllCaches(): Promise<void> {
    this.clearMemoryCache();
    await this.clearRedisCache();
    console.log("All caches cleared");
  }
}

export const cacheService = new CacheService();
