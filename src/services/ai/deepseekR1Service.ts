
import { MessageProps } from '@/components/ai/Message';
import { deepseekAPIService } from './deepseek/services/deepseekAPIService';
import { categorizeIntent } from './deepseek/utils/deepseekUtils';

/**
 * DeepSeek R1 Service for AI-powered ESG insights
 */
class DeepseekR1Service {
  /**
   * Process query using DeepSeek R1 API with caching
   */
  async processQuery(query: string, previousMessages: MessageProps[] = [], customSystemPrompt?: string): Promise<string> {
    return deepseekAPIService.processQuery(query, previousMessages, customSystemPrompt);
  }
  
  /**
   * Categorize user intent based on query content
   * Exposed for use by other services
   */
  categorizeIntent(query: string) {
    return categorizeIntent(query);
  }
}

export const deepseekR1Service = new DeepseekR1Service();
