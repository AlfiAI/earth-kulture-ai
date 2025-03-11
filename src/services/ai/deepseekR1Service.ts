
/**
 * DeepseekR1Service - Service for using DeepSeek-R1 reasoning functionality
 */
import { deepseekAPIService } from './deepseek/services/deepseekAPIService';
import { DeepseekRequestOptions } from './deepseek/types/deepseekTypes';

export class DeepSeekR1ServiceImpl {
  /**
   * Process a query specifically using the DeepSeek-R1 reasoning model
   */
  async processQuery(
    query: string, 
    conversationContext: any[] = [], 
    systemPrompt?: string
  ): Promise<string> {
    const options: DeepseekRequestOptions = {
      preferredModel: 'deepseek-reasoner'
    };
    
    if (systemPrompt) {
      options.systemPrompt = systemPrompt;
    }
    
    return await deepseekAPIService.processQuery(query, conversationContext, options);
  }
  
  /**
   * Categorize the intent of a user query
   */
  async categorizeIntent(query: string): Promise<string> {
    return await deepseekAPIService.categorizeIntent(query);
  }
}

export const deepseekR1Service = new DeepSeekR1ServiceImpl();
