
// This is a frontend service that simulates Redis caching
// In production, actual Redis operations would happen in Edge Functions

class RedisCacheService {
  private cache: Record<string, any> = {};
  private cacheTTL: Record<string, number> = {};
  
  // Default TTL is 5 minutes
  private DEFAULT_TTL = 5 * 60 * 1000;
  
  // Get a cached value
  async get<T>(key: string): Promise<T | null> {
    // Check if key exists and hasn't expired
    if (this.cache[key] && this.cacheTTL[key] > Date.now()) {
      console.log(`Cache hit for key: ${key}`);
      return this.cache[key] as T;
    }
    
    console.log(`Cache miss for key: ${key}`);
    return null;
  }
  
  // Set a value in cache with optional TTL in seconds
  async set(key: string, value: any, ttlInSeconds?: number): Promise<void> {
    this.cache[key] = value;
    
    // Set expiration time
    const ttlMs = (ttlInSeconds || 300) * 1000; // Default 5 minutes
    this.cacheTTL[key] = Date.now() + ttlMs;
    
    console.log(`Cached key: ${key} with TTL: ${ttlInSeconds || 300}s`);
  }
  
  // Delete a key from cache
  async delete(key: string): Promise<void> {
    delete this.cache[key];
    delete this.cacheTTL[key];
    console.log(`Deleted key from cache: ${key}`);
  }
  
  // Clear all cache
  async clear(): Promise<void> {
    this.cache = {};
    this.cacheTTL = {};
    console.log('Cache cleared');
  }
  
  // Get all cached keys
  async keys(): Promise<string[]> {
    return Object.keys(this.cache);
  }
  
  // Get multiple keys at once (batch operation)
  async mget<T>(keys: string[]): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {};
    
    for (const key of keys) {
      result[key] = await this.get<T>(key);
    }
    
    return result;
  }
  
  // Set multiple keys at once (batch operation)
  async mset(keyValues: Record<string, any>, ttlInSeconds?: number): Promise<void> {
    for (const [key, value] of Object.entries(keyValues)) {
      await this.set(key, value, ttlInSeconds);
    }
  }
  
  // Get cache stats (size, hit rate, etc.)
  getStats(): { size: number, keys: string[] } {
    return {
      size: Object.keys(this.cache).length,
      keys: Object.keys(this.cache)
    };
  }
}

export const redisCache = new RedisCacheService();
