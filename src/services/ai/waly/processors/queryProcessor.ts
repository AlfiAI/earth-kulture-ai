
import { MessageProps } from '@/components/ai/Message';
import { deepseekR1Service } from '../../deepseekR1Service';
import { legacyProcessQuery } from '../../processors/legacyProcessor';

/**
 * Process user query using DeepSeek R1 API with fallback to legacy processing
 */
export async function processQuery(query: string, messageHistory: MessageProps[] = []): Promise<string> {
  try {
    // Process the query using DeepSeek R1 API
    const response = await deepseekR1Service.processQuery(query, messageHistory);
    return response;
  } catch (error) {
    console.error('Error processing query with DeepSeek R1:', error);
    
    // Fallback to legacy processing
    return legacyProcessQuery(query);
  }
}
