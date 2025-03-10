
import { MessageProps } from '@/components/ai/Message';
import { deepseekR1Service } from '../../deepseekR1Service';
import { legacyProcessQuery } from '../../processors/legacyProcessor';
import { toast } from "sonner";

/**
 * Process user query using DeepSeek R1 API with fallback to legacy processing
 */
export async function processQuery(query: string, messageHistory: MessageProps[] = []): Promise<string> {
  try {
    console.log('Processing query with DeepSeek R1 API:', query);
    // Process the query using DeepSeek R1 API
    const response = await deepseekR1Service.processQuery(query, messageHistory);
    console.log('DeepSeek R1 API response received');
    return response;
  } catch (error) {
    console.error('Error processing query with DeepSeek R1:', error);
    toast.error('AI service connection issue. Using fallback mode.');
    
    // Fallback to legacy processing
    return legacyProcessQuery(query);
  }
}
