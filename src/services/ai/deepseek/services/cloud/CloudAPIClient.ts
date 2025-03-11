
/**
 * CloudAPIClient - Handles cloud-based DeepSeek API communication
 */
import { toast } from "sonner";
import { DeepseekR1Response } from '../../types/deepseekTypes';
import { DEEPSEEK_API_URL, DEEPSEEK_API_KEY } from '../../constants/deepseekConstants';

export class CloudAPIClient {
  /**
   * Call DeepSeek cloud API with appropriate parameters
   */
  async callDeepSeekAPI(
    messages: any[],
    modelConfig: {
      model: string;
      temperature: number;
      max_tokens: number;
      top_p: number;
    }
  ): Promise<DeepseekR1Response> {
    console.log(`Calling DeepSeek API with model ${modelConfig.model}`);
    
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
      throw new Error(`DeepSeek API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    return await response.json();
  }
}

export const cloudAPIClient = new CloudAPIClient();
