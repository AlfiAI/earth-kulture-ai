
import { toast } from "sonner";
import { ESGDataPoint } from '../types/esgTypes';
import { cacheService } from './cache/cacheService';
import { databaseService } from './database/databaseService';
import { dataProcessingService } from './processing/dataProcessingService';

class DataService {
  // Fetch ESG data points with pagination
  async fetchESGData(page = 1, pageSize = 20, useCache = true): Promise<{
    data: ESGDataPoint[];
    count: number;
  }> {
    try {
      // First check Redis cache
      const cacheKey = cacheService.getESGDataCacheKey(page, pageSize);
      
      if (useCache) {
        // Try Redis cache first
        const cachedData = await cacheService.getFromRedis<{data: ESGDataPoint[], count: number}>(cacheKey);
        if (cachedData) {
          console.log("Using Redis cached ESG data");
          return cachedData;
        }
        
        // Try in-memory cache next
        const memoryCachedData = cacheService.getFromMemoryCache(page, pageSize);
        if (memoryCachedData) {
          return memoryCachedData;
        }
      }
      
      // For development/testing, use Supabase first
      try {
        const { data, count } = await databaseService.fetchFromSupabase(page, pageSize);
        
        // Cache results in Redis
        await cacheService.setInRedis(cacheKey, { data, count }, 300); // Cache for 5 minutes
        
        // Also update in-memory cache on first page
        if (page === 1) {
          cacheService.setMemoryCache(data);
        }
        
        return { data, count };
      } catch (error) {
        console.log("Falling back to mock data service");
        const { esgDataCoreService } = await import('../core/esgDataService');
        const mockData = await esgDataCoreService.getAllESGData();
        
        // Cache the data
        cacheService.setMemoryCache(mockData);
        
        // Apply pagination
        const startIndex = (page - 1) * pageSize;
        const paginatedData = mockData.slice(startIndex, startIndex + pageSize);
        
        return {
          data: paginatedData,
          count: mockData.length
        };
      }
    } catch (error) {
      console.error("Error fetching ESG data:", error);
      toast.error("Failed to load ESG data");
      return { data: [], count: 0 };
    }
  }

  // Process a data point with optimized database insertion
  async processDataPoint(dataPoint: Partial<ESGDataPoint>): Promise<ESGDataPoint | null> {
    try {
      // For development, we'll use Supabase first
      try {
        const result = await databaseService.processWithSupabase(dataPoint);
        
        // Clear cache to ensure fresh data on next fetch
        await cacheService.clearAllCaches();
        
        return result;
      } catch (error) {
        console.log("Falling back to mock data service for processing");
        return await dataProcessingService.processMockData(dataPoint);
      }
    } catch (error) {
      console.error("Error processing data point:", error);
      toast.error("Failed to process data");
      return null;
    }
  }

  // Clear cache to force fresh data fetch
  clearCache(): void {
    cacheService.clearAllCaches();
  }
}

export const dataService = new DataService();
