
import { toast } from "sonner";
import { MessageProps } from '@/components/ai/Message';

// Constants
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_API_KEY = "sk-c31c53e99fee40fb8e0cc5f70cdeb452"; // Your DeepSeek API key

// System prompt for ESG & Carbon Intelligence
const ESG_SYSTEM_PROMPT = `You are Waly, an expert ESG & Carbon Intelligence Assistant specializing in sustainability reporting, emissions analysis, 
and regulatory compliance. You provide data-driven insights and actionable recommendations to help organizations improve their sustainability practices.

You have expertise in:
- Carbon footprint calculation (Scope 1, 2, and 3 emissions)
- ESG reporting frameworks (GHG Protocol, TCFD, GRI, SASB, EU Taxonomy, CDP)
- Sustainability strategy development
- Regulatory compliance tracking
- Industry benchmarking and trend analysis

Always provide specific, actionable insights based on industry best practices. When appropriate, reference relevant regulations, frameworks, or methodologies.
Keep responses concise but informative, focusing on practical advice and clear explanations.`;

// Interface for API response
interface DeepseekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class DeepseekService {
  // Process query using DeepSeek API
  async processQuery(query: string, previousMessages: MessageProps[] = [], customSystemPrompt?: string): Promise<string> {
    try {
      // Format previous messages for context
      const formattedMessages = this.formatMessagesForAPI(previousMessages);
      
      // Use custom system prompt if provided, otherwise use default
      const systemPrompt = customSystemPrompt || ESG_SYSTEM_PROMPT;
      
      // Add system prompt and user query
      const messages = [
        { role: "system", content: systemPrompt },
        ...formattedMessages,
        { role: "user", content: query }
      ];
      
      console.log("Calling DeepSeek API with formatted messages:", messages);
      
      // Call DeepSeek API
      const response = await fetch(DEEPSEEK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",  // Use a valid model name
          messages: messages,
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("DeepSeek API returned an error:", errorData);
        throw new Error(`DeepSeek API Error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data: DeepseekResponse = await response.json();
      console.log("DeepSeek API response:", data);
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      toast.error("Failed to get AI response. Using fallback mode.");
      // Fallback to local processing if API fails
      return this.fallbackProcessQuery(query);
    }
  }
  
  // Format message history for API
  private formatMessagesForAPI(messages: MessageProps[]): { role: string, content: string }[] {
    return messages
      .filter(msg => msg.id !== '1') // Filter out the welcome message
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
  }
  
  // Fallback method if API fails
  private fallbackProcessQuery(query: string): string {
    // Simple keyword matching to simulate AI understanding
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('carbon') || lowerQuery.includes('emission')) {
      return "Based on your carbon emissions data, I can provide some insights. However, I'm currently operating in fallback mode due to API connectivity issues. Please try again later for more detailed analysis.";
    }
    
    if (lowerQuery.includes('esg') || lowerQuery.includes('compliance')) {
      return "I can help with ESG compliance matters, but I'm currently operating in fallback mode. For accurate compliance insights, please try again when our API connection is restored.";
    }
    
    return "I apologize, but I'm currently experiencing connection issues with my knowledge base. I'm operating in fallback mode with limited capabilities. Please try again later for full functionality.";
  }
}

export const deepseekService = new DeepseekService();
