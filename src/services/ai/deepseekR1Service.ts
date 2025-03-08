
import { toast } from "sonner";
import { MessageProps } from '@/components/ai/Message';
import { redisCache } from '../cache/redisCache';

// Constants
const DEEPSEEK_R1_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_R1_API_KEY = "sk-c31c53e99fee40fb8e0cc5f70cdeb452"; // Your DeepSeek API key

// System prompt for ESG & Carbon Intelligence with enhanced capabilities
const ENHANCED_ESG_SYSTEM_PROMPT = `You are Waly Pro, an advanced ESG & Carbon Intelligence Assistant specialized in sustainability reporting, emissions analysis, 
and regulatory compliance. You provide data-driven insights and actionable recommendations to help organizations improve their sustainability practices.

You have expertise in:
- Carbon footprint calculation and optimization (Scope 1, 2, and 3 emissions)
- ESG reporting frameworks (GHG Protocol, TCFD, GRI, SASB, EU Taxonomy, CDP)
- Sustainability strategy development with industry benchmarking
- Regulatory compliance tracking and risk prediction
- AI-powered trend analysis and forecasting
- Goal-setting and performance optimization

Your capabilities include:
- Predictive ESG risk assessments
- Industry-specific benchmarking
- Multi-turn contextual conversations
- Personalized sustainability recommendations
- Compliance risk detection
- Performance trend analysis

Always provide specific, actionable insights based on industry best practices. Include relevant regulations, frameworks, or methodologies when appropriate.
Keep responses structured, focusing on practical advice, clear explanations, and data-backed recommendations.`;

// Interface for API response
interface DeepseekR1Response {
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

class DeepseekR1Service {
  // Process query using DeepSeek R1 API with caching
  async processQuery(query: string, previousMessages: MessageProps[] = [], customSystemPrompt?: string): Promise<string> {
    try {
      // Create a cache key based on the query and recent conversation context
      const recentMessages = previousMessages.slice(-5); // Use last 5 messages for context
      const cacheKey = `deepseek_${this.hashString(query + JSON.stringify(recentMessages))}`;
      
      // Check cache first
      const cachedResponse = await redisCache.get<string>(cacheKey);
      if (cachedResponse) {
        console.log("Using cached DeepSeek response");
        return cachedResponse;
      }
      
      // Format previous messages for context
      const formattedMessages = this.formatMessagesForAPI(previousMessages);
      
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
  
  // Format message history for API
  private formatMessagesForAPI(messages: MessageProps[]): { role: string, content: string }[] {
    return messages
      .filter(msg => msg.id !== '1') // Filter out the welcome message
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
  }
  
  // Simple hash function for generating cache keys
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }
  
  // Categorize user intent based on query content
  categorizeIntent(query: string): 'compliance' | 'reporting' | 'benchmarking' | 'carbon' | 'general' {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('compliance') || lowerQuery.includes('regulation') || lowerQuery.includes('requirement')) {
      return 'compliance';
    }
    
    if (lowerQuery.includes('report') || lowerQuery.includes('document') || lowerQuery.includes('disclosure')) {
      return 'reporting';
    }
    
    if (lowerQuery.includes('compare') || lowerQuery.includes('benchmark') || lowerQuery.includes('industry') || lowerQuery.includes('competitor')) {
      return 'benchmarking';
    }
    
    if (lowerQuery.includes('carbon') || lowerQuery.includes('emission') || lowerQuery.includes('footprint') || lowerQuery.includes('ghg')) {
      return 'carbon';
    }
    
    return 'general';
  }
  
  // Fallback method if API fails
  private fallbackProcessQuery(query: string): string {
    // Enhanced keyword matching to simulate AI understanding
    const lowerQuery = query.toLowerCase();
    const intent = this.categorizeIntent(query);
    
    switch (intent) {
      case 'compliance':
        return "Based on my analysis of your compliance data, I can provide insights on regulatory requirements and frameworks. However, I'm currently operating in fallback mode due to API connectivity issues. For comprehensive compliance analysis, please try again when our connection is restored.";
      
      case 'reporting':
        return "I can help generate ESG reports tailored to different frameworks and stakeholders. In fallback mode, I have limited access to report templates and custom formatting. Please try again later for full reporting capabilities.";
      
      case 'benchmarking':
        return "Industry benchmarking requires access to our comprehensive database of sector-specific ESG metrics. I'm currently in fallback mode with limited access to comparative data. For detailed benchmarking analysis, please try again when full connectivity is restored.";
      
      case 'carbon':
        return "I can analyze your carbon emissions data across Scopes 1, 2, and 3 to provide reduction strategies. In fallback mode, I can offer general recommendations, but for detailed carbon analysis and predictive modeling, please try again when our API connection is restored.";
      
      default:
        return "I'm here to assist with your ESG and sustainability questions. I'm currently operating in fallback mode with limited capabilities due to connectivity issues. For full AI-powered insights, please try again later when our connection is restored.";
    }
  }
}

export const deepseekR1Service = new DeepseekR1Service();
