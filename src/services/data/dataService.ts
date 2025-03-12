import { toast } from "sonner";
import { ESGDataPoint } from '../types/esgTypes';
import { cacheService } from './cache/cacheService';
import { databaseService } from './database/databaseService';
import { dataProcessingService } from './processing/dataProcessingService';
import { aiAgentOrchestrator } from '../ai/orchestration/aiAgentOrchestrator';
import { esgMonitoringService } from '../ai/monitoring/esgMonitoringService';
import { TaskPriority } from '../ai/orchestration/types/agentTypes';

class DataService {
  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      setTimeout(() => {
        esgMonitoringService.startAutomatedMonitoring(30);
      }, 5000);
    }
  }

  async fetchESGData(page = 1, pageSize = 20, useCache = true): Promise<{
    data: ESGDataPoint[];
    count: number;
  }> {
    try {
      const cacheKey = cacheService.getESGDataCacheKey(page, pageSize);
      
      if (useCache) {
        const cachedData = await cacheService.getFromRedis<{data: ESGDataPoint[], count: number}>(cacheKey);
        if (cachedData) {
          console.log("Using Redis cached ESG data");
          return cachedData;
        }
        
        const memoryCachedData = cacheService.getFromMemoryCache(page, pageSize);
        if (memoryCachedData) {
          return memoryCachedData;
        }
      }
      
      try {
        const { data, count } = await databaseService.fetchFromSupabase(page, pageSize);
        
        this.processDataWithAI(data);
        
        await cacheService.setInRedis(cacheKey, { data, count }, 300);
        
        if (page === 1) {
          cacheService.setMemoryCache(data);
        }
        
        return { data, count };
      } catch (error) {
        console.log("Falling back to mock data service");
        const { esgDataCoreService } = await import('../core/esgDataService');
        const mockData = await esgDataCoreService.getAllESGData();
        
        cacheService.setMemoryCache(mockData);
        
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

  async processDataPoint(dataPoint: Partial<ESGDataPoint>): Promise<ESGDataPoint | null> {
    try {
      const taskId = await aiAgentOrchestrator.submitTask('data-processing', {
        dataPoint,
        action: 'validate-data-point'
      }, TaskPriority.HIGH);
      
      try {
        const result = await databaseService.processWithSupabase(dataPoint);
        
        await cacheService.clearAllCaches();
        
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

  clearCache(): void {
    cacheService.clearAllCaches();
  }
  
  private async processDataWithAI(data: ESGDataPoint[]): Promise<void> {
    if (!data || data.length === 0) return;
    
    try {
      await aiAgentOrchestrator.submitTask('data-processing', {
        data,
        action: 'batch-process'
      }, TaskPriority.LOW);
    } catch (error) {
      console.error("Error submitting data for AI processing:", error);
    }
  }
}

export const dataService = new DataService();
