
import { MessageProps } from '@/components/ai/Message';
import { IntentCategory, DeepseekMessage } from '../types/deepseekTypes';

/**
 * Format message history for API
 */
export function formatMessagesForAPI(messages: MessageProps[]): DeepseekMessage[] {
  return messages
    .filter(msg => msg.id !== '1') // Filter out the welcome message
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
}

/**
 * Generate a hash for a string (used for caching)
 */
export function hashString(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString();
}

/**
 * Categorize user intent based on query content
 */
export function categorizeIntent(query: string): IntentCategory {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('regulation') || 
      lowerQuery.includes('compliance') || 
      lowerQuery.includes('legal') ||
      lowerQuery.includes('requirement')) {
    return 'compliance';
  }
  
  if (lowerQuery.includes('report') || 
      lowerQuery.includes('document') || 
      lowerQuery.includes('publish') ||
      lowerQuery.includes('disclose')) {
    return 'reporting';
  }
  
  if (lowerQuery.includes('compare') || 
      lowerQuery.includes('benchmark') || 
      lowerQuery.includes('industry') ||
      lowerQuery.includes('competitor')) {
    return 'benchmarking';
  }
  
  if (lowerQuery.includes('carbon') || 
      lowerQuery.includes('emission') || 
      lowerQuery.includes('footprint') ||
      lowerQuery.includes('greenhouse')) {
    return 'carbon';
  }
  
  return 'general';
}

/**
 * Fallback method if API fails
 */
export function generateFallbackResponse(query: string): string {
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
