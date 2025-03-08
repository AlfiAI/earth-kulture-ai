
import { toast } from "sonner";
import { MessageProps } from '@/components/ai/Message';
import { redisCache } from '@/services/cache/redisCache';
import { DeepseekR1Response } from '../types/deepseekTypes';
import { 
  DEEPSEEK_R1_URL, 
  DEEPSEEK_R1_API_KEY, 
  ENHANCED_ESG_SYSTEM_PROMPT 
} from '../constants/deepseekConstants';
import { 
  formatMessagesForAPI, 
  hashString, 
  generateFallbackResponse 
} from '../utils/deepseekUtils';

/**
 * Implementation of the DeepSeek R1 Service
 */
class DeepseekAPIService {
  /**
   * Process query using DeepSeek R1 API with caching
   */
  async processQuery(query: string, previousMessages: MessageProps[] = [], customSystemPrompt?: string): Promise<string> {
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
      
      // Format previous messages for context
      const formattedMessages = formatMessagesForAPI(previousMessages);
      
      // Use custom system prompt if provided, otherwise use default enhanced prompt
      const systemPrompt = customSystemPrompt || ENHANCED_ESG_SYSTEM_PROMPT;
      
      // Add system prompt and user query
      const messages = [
        { role: "system", content: systemPrompt },
        ...formattedMessages,
        { role: "user", content: query }
      ];
      
      console.log("Calling DeepSeek R1 API with formatted messages");
      
      // Call DeepSeek R1 API
      const response = await fetch(DEEPSEEK_R1_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_R1_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",  // Use the appropriate DeepSeek model
          messages: messages,
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 1500,
          stream: false
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("DeepSeek R1 API returned an error:", errorData);
        throw new Error(`DeepSeek R1 API Error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data: DeepseekR1Response = await response.json();
      console.log("DeepSeek R1 API response received");
      
      const aiResponse = data.choices[0].message.content;
      
      // Cache the response for future use (expires in 30 minutes)
      await redisCache.set(cacheKey, aiResponse, 30 * 60);
      
      return aiResponse;
    } catch (error) {
      console.error('Error calling DeepSeek R1 API:', error);
      toast.error("Failed to get enhanced AI response. Using fallback mode.");
      // Fallback to local processing if API fails
      return this.fallbackProcessQuery(query);
    }
  }
  
  /**
   * Fallback method if API fails
   */
  private fallbackProcessQuery(query: string): string {
    return generateFallbackResponse(query);
  }
}

export const deepseekAPIService = new DeepseekAPIService();
