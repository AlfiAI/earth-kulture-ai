
import { toast } from "sonner";
import { MessageProps } from '@/components/ai/Message';
import { DeepseekR1Response } from '../types/deepseekTypes';
import { 
  ENHANCED_ESG_SYSTEM_PROMPT,
  STANDARD_ESG_SYSTEM_PROMPT
} from '../constants/deepseekConstants';
import { formatMessagesForAPI } from '../utils/deepseekUtils';
import { getModelConfiguration, isDiscountPeriod } from '../utils/modelSelectionUtils';
import { localAIProcessor } from './local/LocalAIProcessor';
import { cloudAPIClient } from './cloud/CloudAPIClient';
import { fallbackService } from './fallback/FallbackService';
import { cacheService } from './cache/CacheService';

/**
 * Implementation of the DeepSeek Service with dynamic model selection
 */
class DeepseekAPIService {
  private apiFailureCount: number = 0;
  private readonly API_FALLBACK_THRESHOLD = 3;

  /**
   * Process query using DeepSeek API with dynamic model selection
   */
  async processQuery(
    query: string, 
    previousMessages: MessageProps[] = [], 
    customSystemPrompt?: string,
    forcedModel?: string,
    requiresReasoning: boolean = false
  ): Promise<string> {
    try {
      // Create a cache key based on the query and recent conversation context
      const recentMessages = previousMessages.slice(-5); // Use last 5 messages for context
      const cacheKey = cacheService.generateCacheKey(query, recentMessages);
      
      // Check cache first
      const cachedResponse = await cacheService.getCachedResponse(cacheKey);
      if (cachedResponse) {
        console.log("Using cached DeepSeek response");
        return cachedResponse;
      }
      
      // Check if we should try local processing first
      if (localAIProcessor.shouldUseLocalAI(query, this.apiFailureCount, this.API_FALLBACK_THRESHOLD)) {
        try {
          // Format previous messages for context
          const formattedMessages = formatMessagesForAPI(previousMessages);
          
          // Use custom system prompt if provided, otherwise use default
          const systemPrompt = customSystemPrompt || STANDARD_ESG_SYSTEM_PROMPT;
          
          const localResponse = await localAIProcessor.processWithLocalAI(query, formattedMessages, systemPrompt);
          
          // Cache the response for future use
          await cacheService.cacheResponse(cacheKey, localResponse);
          
          console.log("Successfully processed with local AI");
          return localResponse;
        } catch (localError) {
          console.error("Local AI processing failed, falling back to cloud API:", localError);
          // Continue to cloud API processing
        }
      }
      
      // Format previous messages for context
      const formattedMessages = formatMessagesForAPI(previousMessages);
      
      // Determine optimal model configuration based on query and context
      const modelConfig = getModelConfiguration(
        query, 
        forcedModel, 
        requiresReasoning,
        previousMessages.length
      );
      
      console.log(`Selected model: ${modelConfig.model} - Reason: ${modelConfig.reason}`);
      
      // Use custom system prompt if provided, otherwise select based on model
      const systemPrompt = customSystemPrompt || 
        (modelConfig.model === 'deepseek-reasoner' ? 
          ENHANCED_ESG_SYSTEM_PROMPT : STANDARD_ESG_SYSTEM_PROMPT);
      
      // Add system prompt and user query
      const messages = [
        { role: "system", content: systemPrompt },
        ...formattedMessages,
        { role: "user", content: query }
      ];
      
      // Log pricing information for debugging
      console.log(`Current pricing tier: ${isDiscountPeriod() ? 'DISCOUNT' : 'STANDARD'}`);
      
      // Call DeepSeek API
      const data = await this.callCloudAPI(messages, modelConfig);
      
      const aiResponse = data.choices[0].message.content;
      
      // Cache the response for future use
      await cacheService.cacheResponse(cacheKey, aiResponse);
      
      return aiResponse;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      toast.error("Failed to get enhanced AI response. Using fallback mode.");
      // Fallback to local processing if API fails
      return this.handleAPIFailure(query);
    }
  }
  
  /**
   * Call cloud-based DeepSeek API
   */
  private async callCloudAPI(
    messages: any[], 
    modelConfig: {
      model: string;
      temperature: number;
      max_tokens: number;
      top_p: number;
      reason: string;
    }
  ): Promise<DeepseekR1Response> {
    try {
      const data = await cloudAPIClient.callDeepSeekAPI(messages, modelConfig);
      
      // Reset API failure count on success
      this.apiFailureCount = 0;
      console.log(`DeepSeek API (${modelConfig.model}) response received`);
      
      return data;
    } catch (error) {
      this.apiFailureCount++;
      throw error;
    }
  }
  
  /**
   * Handle API failures with appropriate fallback logic
   */
  private async handleAPIFailure(query: string): Promise<string> {
    // If we've hit the threshold, try local processing as fallback
    if (this.apiFailureCount >= this.API_FALLBACK_THRESHOLD) {
      try {
        const formattedMessages: any[] = [];
        const localResponse = await localAIProcessor.processWithLocalAI(
          query, 
          formattedMessages, 
          STANDARD_ESG_SYSTEM_PROMPT
        );
        return localResponse;
      } catch (localError) {
        console.error("Both cloud and local AI processing failed:", localError);
      }
    }
    
    // Ultimate fallback
    return fallbackService.getFallbackResponse(query);
  }
}

export const deepseekAPIService = new DeepseekAPIService();
