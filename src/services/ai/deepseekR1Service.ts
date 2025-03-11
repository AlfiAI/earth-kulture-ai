
/**
 * DeepseekR1Service - Service for using DeepSeek-R1 reasoning functionality
 */
import { deepseekAPIService } from './deepseek/services/deepseekAPIService';

export class DeepSeekR1ServiceImpl {
  /**
   * Process a query specifically using the DeepSeek-R1 reasoning model
   */
  async processQuery(query: string, conversationContext: any[] = []): Promise<string> {
    return await deepseekAPIService.processQuery(query, conversationContext, {
      preferredModel: 'deepseek-reasoner'
    });
  }
  
  /**
   * Categorize the intent of a user query
   */
  async categorizeIntent(query: string): Promise<string> {
    return await deepseekAPIService.categorizeIntent(query);
  }
}

export const deepseekR1Service = new DeepSeekR1ServiceImpl();
