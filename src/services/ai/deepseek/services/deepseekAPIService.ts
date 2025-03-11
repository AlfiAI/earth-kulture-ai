
import { toast } from "sonner";
import { MessageProps } from '@/components/ai/Message';
import { redisCache } from '@/services/cache/redisCache';
import { DeepseekR1Response } from '../types/deepseekTypes';
import { 
  DEEPSEEK_API_URL, 
  DEEPSEEK_API_KEY,
  ENHANCED_ESG_SYSTEM_PROMPT,
  STANDARD_ESG_SYSTEM_PROMPT
} from '../constants/deepseekConstants';
import { 
  formatMessagesForAPI, 
  hashString, 
  generateFallbackResponse 
} from '../utils/deepseekUtils';
import {
  getModelConfiguration,
  isDiscountPeriod
} from '../utils/modelSelectionUtils';

/**
 * Implementation of the DeepSeek Service with dynamic model selection
 */
class DeepseekAPIService {
  // Track local AI availability for hybrid execution
  private localAIAvailable: boolean | null = null;
  private lastLocalAICheck: number = 0;
  private apiFailureCount: number = 0;
  private readonly API_FALLBACK_THRESHOLD = 3;
  private readonly LOCAL_API_URL = "http://localhost:11434/api/chat";
  private readonly LOCAL_MODEL_NAME = "llama3";

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
      const cacheKey = `deepseek_${hashString(query + JSON.stringify(recentMessages))}`;
      
      // Check cache first
      const cachedResponse = await redisCache.get<string>(cacheKey);
      if (cachedResponse) {
        console.log("Using cached DeepSeek response");
        return cachedResponse;
      }
      
      // Check if we should try local processing first
      if (this.shouldUseLocalAI(query)) {
        try {
          const localResponse = await this.processWithLocalAI(query, previousMessages, customSystemPrompt);
          
          // Cache the response for future use (expires in 30 minutes)
          await redisCache.set(cacheKey, localResponse, 30 * 60);
          
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
      
      console.log(`Calling DeepSeek API with model ${modelConfig.model}`);
      
      // Log pricing information for debugging
      console.log(`Current pricing tier: ${isDiscountPeriod() ? 'DISCOUNT' : 'STANDARD'}`);
      
      // Call DeepSeek API
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: modelConfig.model,
          messages: messages,
          temperature: modelConfig.temperature,
          top_p: modelConfig.top_p,
          max_tokens: modelConfig.max_tokens,
          stream: false
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`DeepSeek API (${modelConfig.model}) returned an error:`, errorData);
        this.apiFailureCount++;
        
        // If we've hit the threshold, try local processing as fallback
        if (this.apiFailureCount >= this.API_FALLBACK_THRESHOLD) {
          try {
            const localResponse = await this.processWithLocalAI(query, previousMessages, customSystemPrompt);
            return localResponse;
          } catch (localError) {
            console.error("Both cloud and local AI processing failed:", localError);
          }
        }
        
        throw new Error(`DeepSeek API Error: ${errorData.error?.message || response.statusText}`);
      }
      
      // Reset API failure count on success
      this.apiFailureCount = 0;
      
      const data: DeepseekR1Response = await response.json();
      console.log(`DeepSeek API (${modelConfig.model}) response received`);
      
      const aiResponse = data.choices[0].message.content;
      
      // Cache the response for future use (expires in 30 minutes)
      await redisCache.set(cacheKey, aiResponse, 30 * 60);
      
      return aiResponse;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      toast.error("Failed to get enhanced AI response. Using fallback mode.");
      // Fallback to local processing if API fails
      return this.fallbackProcessQuery(query);
    }
  }
  
  /**
   * Process query with local AI model
   */
  private async processWithLocalAI(query: string, previousMessages: MessageProps[] = [], customSystemPrompt?: string): Promise<string> {
    // Check if local AI is available
    if (!(await this.checkLocalAIAvailability())) {
      throw new Error("Local AI is not available");
    }
    
    // Format previous messages for context
    const formattedMessages = formatMessagesForAPI(previousMessages);
    
    // Use custom system prompt if provided, otherwise use default
    const systemPrompt = customSystemPrompt || "You are an ESG and sustainability expert.";
    
    // Add system prompt and user query
    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedMessages,
      { role: "user", content: query }
    ];
    
    console.log("Processing with local AI model", this.LOCAL_MODEL_NAME);
    
    const response = await fetch(this.LOCAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.LOCAL_MODEL_NAME,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Local AI Error: ${errorText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  /**
   * Check if local AI is available
   */
  private async checkLocalAIAvailability(): Promise<boolean> {
    // Cache the check for 5 minutes
    const now = Date.now();
    if (this.localAIAvailable !== null && (now - this.lastLocalAICheck) < 5 * 60 * 1000) {
      return this.localAIAvailable;
    }
    
    try {
      const response = await fetch(this.LOCAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.LOCAL_MODEL_NAME,
          messages: [{ role: "user", content: "hello" }],
          max_tokens: 1
        }),
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      this.localAIAvailable = response.ok;
      this.lastLocalAICheck = now;
      return this.localAIAvailable;
    } catch (error) {
      console.error("Error checking local AI availability:", error);
      this.localAIAvailable = false;
      this.lastLocalAICheck = now;
      return false;
    }
  }
  
  /**
   * Determine if we should use local AI based on query complexity
   */
  private shouldUseLocalAI(query: string): boolean {
    // Simple complexity check - can be made more sophisticated
    const isSimpleQuery = query.length < 100 && !query.includes("complex") && 
                         !query.includes("analyze") && !query.includes("compare");
    
    return isSimpleQuery && this.apiFailureCount < this.API_FALLBACK_THRESHOLD;
  }
  
  /**
   * Fallback method if all AI processing fails
   */
  private fallbackProcessQuery(query: string): string {
    return generateFallbackResponse(query);
  }
}

export const deepseekAPIService = new DeepseekAPIService();
