
/**
 * DeepseekAPIService - Orchestrates AI processing by coordinating between local, cloud, and fallback services
 */
import { redisCache } from '@/services/cache/redisCache';
import { cacheService } from './cache/CacheService';
import { localAIProcessor } from './local/LocalAIProcessor';
import { cloudAPIClient } from './cloud/CloudAPIClient';
import { fallbackService } from './fallback/FallbackService';
import { determineModelForQuery } from '../utils/modelSelectionUtils';
import { hashString, formatAPIResponse } from '../utils/deepseekUtils';
import { ModelType } from '../types/deepseekTypes';

export class DeepseekAPIService {
  /**
   * Process a query through the optimal processing path (local, cloud, or fallback)
   */
  async processQuery(
    query: string, 
    conversationContext: any[] = [], 
    options: { preferredModel?: ModelType, forceCloud?: boolean } = {}
  ): Promise<string> {
    try {
      // Try to get a cached response first
      const cacheKey = cacheService.generateCacheKey(query, conversationContext);
      const cachedResponse = await cacheService.getCachedResponse(cacheKey);
      
      if (cachedResponse) {
        console.log('Using cached response for query');
        return cachedResponse;
      }

      // Determine the best model for this query based on complexity, time of day, etc.
      const modelToUse = options.preferredModel || 
        determineModelForQuery(query, conversationContext);
      
      // First try local processing unless explicitly requested to use cloud
      let response: string | null = null;
      
      if (!options.forceCloud) {
        response = await localAIProcessor.processLocally(query, conversationContext, modelToUse);
      }
      
      // If local processing failed or was skipped, try cloud API
      if (!response) {
        response = await cloudAPIClient.callCloudAPI(query, conversationContext, modelToUse);
      }
      
      // If we got a response, cache it and return
      if (response) {
        await cacheService.cacheResponse(cacheKey, response);
        return response;
      }
      
      // If all else fails, use fallback
      return fallbackService.getFallbackResponse(query);
    } catch (error) {
      console.error('Error in DeepseekAPIService.processQuery:', error);
      return fallbackService.getFallbackResponse(query);
    }
  }

  /**
   * Categorize the intent of a query
   */
  async categorizeIntent(query: string): Promise<string> {
    try {
      const cacheKey = `intent_${hashString(query)}`;
      const cachedIntent = await redisCache.get<string>(cacheKey);
      
      if (cachedIntent) {
        return cachedIntent;
      }
      
      // Always use the reasoning model for intent categorization
      const response = await cloudAPIClient.callCloudAPI(
        `Categorize this query into one of these intents: ANALYSIS, PREDICTION, RECOMMENDATION, FACTUAL, GUIDANCE, OTHER. Just return the category name without explanation. Query: ${query}`,
        [],
        'deepseek-reasoner'
      );
      
      const intent = formatAPIResponse(response || 'OTHER');
      await redisCache.set(cacheKey, intent, 60 * 60 * 24); // Cache for 24 hours
      return intent;
    } catch (error) {
      console.error('Error categorizing intent:', error);
      return 'OTHER';
    }
  }
}

export const deepseekAPIService = new DeepseekAPIService();
