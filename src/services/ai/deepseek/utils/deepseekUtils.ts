
import { MessageProps } from '@/components/ai/Message';
import { IntentCategory } from '../types/deepseekTypes';

/**
 * Utility functions for DeepSeek R1 service
 */

/**
 * Format message history for API
 */
export function formatMessagesForAPI(messages: MessageProps[]): { role: string, content: string }[] {
  return messages
    .filter(msg => msg.id !== '1') // Filter out the welcome message
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
}

/**
 * Simple hash function for generating cache keys
 */
export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Categorize user intent based on query content
 */
export function categorizeIntent(query: string): IntentCategory {
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

/**
 * Generate fallback response based on intent category
 */
export function generateFallbackResponse(query: string): string {
  const intent = categorizeIntent(query);
  
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
