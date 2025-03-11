
/**
 * CloudAPIClient - Handles API calls to DeepSeek cloud API
 */
import { 
  DEEPSEEK_API_BASE_URL, 
  DEEPSEEK_API_KEY, 
  MODEL_CONFIG 
} from '../../constants/deepseekConstants';
import { formatAPIResponse } from '../../utils/deepseekUtils';
import { ModelType } from '../../types/deepseekTypes';

export class CloudAPIClient {
  /**
   * Call the DeepSeek cloud API
   */
  async callCloudAPI(
    query: string, 
    conversationContext: any[] = [],
    modelType: ModelType = 'deepseek-chat'
  ): Promise<string | null> {
    try {
      if (!DEEPSEEK_API_KEY) {
        console.error('DeepSeek API key is not configured');
        return null;
      }
      
      const systemPrompt = MODEL_CONFIG[modelType]?.systemPrompt || 'You are a helpful assistant.';
      
      // Prepare messages for the API
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationContext,
        { role: 'user', content: query }
      ];
      
      // Call the API
      const response = await fetch(`${DEEPSEEK_API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: modelType,
          messages: messages,
          temperature: MODEL_CONFIG[modelType]?.temperature || 0.7,
          max_tokens: MODEL_CONFIG[modelType]?.maxTokens || 4000,
          stream: false
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('DeepSeek API error:', errorData);
        return null;
      }
      
      const data = await response.json();
      return formatAPIResponse(data?.choices?.[0]?.message?.content || '');
    } catch (error) {
      console.error('Error calling DeepSeek cloud API:', error);
      return null;
    }
  }
}

export const cloudAPIClient = new CloudAPIClient();
