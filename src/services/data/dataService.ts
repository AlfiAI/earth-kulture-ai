
import { toast } from "sonner";
import { ESGDataPoint } from '../types/esgTypes';
import { cacheService } from './cache/cacheService';
import { databaseService } from './database/databaseService';
import { dataProcessingService } from './processing/dataProcessingService';
import { aiAgentOrchestrator } from '../ai/orchestration/aiAgentOrchestrator';
import { esgMonitoringService } from '../ai/monitoring/esgMonitoringService';

class DataService {
  // Start the AI monitoring systems when the service is created
  constructor() {
    // Start ESG monitoring with a 30-minute interval
    // Only in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      setTimeout(() => {
        esgMonitoringService.startAutomatedMonitoring(30);
      }, 5000); // Delay startup to allow app to initialize
    }
  }

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
        
        // Send data for AI processing in the background
        this.processDataWithAI(data);
        
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

  // Process a data point with optimized database insertion and AI validation
  async processDataPoint(dataPoint: Partial<ESGDataPoint>): Promise<ESGDataPoint | null> {
    try {
      // Submit to data processing agent for validation before saving
      const taskId = await aiAgentOrchestrator.submitTask('data-processing', {
        dataPoint,
        action: 'validate-data-point'
      }, 'high');
      
      // For development, we'll use Supabase first
      try {
        const result = await databaseService.processWithSupabase(dataPoint);
        
        // Clear cache to ensure fresh data on next fetch
        await cacheService.clearAllCaches();
        
        // Run ESG monitoring check to capture any potential issues
        esgMonitoringService.runMonitoringCheck();
        
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
  
  // Process data with AI in the background
  private async processDataWithAI(data: ESGDataPoint[]): Promise<void> {
    if (!data || data.length === 0) return;
    
    try {
      // Submit batch processing task
      await aiAgentOrchestrator.submitTask('data-processing', {
        data,
        action: 'batch-process'
      }, 'low');
      
      // No need to wait for the result as this is a background task
    } catch (error) {
      console.error("Error submitting data for AI processing:", error);
      // Don't show toast as this is a background operation
    }
  }
}

export const dataService = new DataService();
