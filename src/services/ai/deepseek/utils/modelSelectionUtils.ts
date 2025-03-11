
/**
 * Model selection utilities for the DeepSeek API
 */
import { ModelType } from '../types/deepseekTypes';
import { MODEL_CONFIG } from '../constants/deepseekConstants';

/**
 * Determine the best model to use based on query complexity, time of day (pricing), etc.
 */
export function determineModelForQuery(
  query: string, 
  conversationContext: any[] = []
): ModelType {
  // Check if it's discount hours (UTC 16:30-00:30)
  const now = new Date();
  const utcHour = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const isDiscountHours = 
    (utcHour > 16 || (utcHour === 16 && utcMinutes >= 30)) || 
    (utcHour < 0 || (utcHour === 0 && utcMinutes <= 30));
  
  // Simple complexity heuristic based on query length and presence of certain keywords
  const isComplexQuery = 
    query.length > 200 || 
    /\b(explain|analyze|compare|reason|complex|detailed)\b/i.test(query) ||
    conversationContext.length > 5;
  
  // During discount hours, prefer the reasoning model for complex queries
  // as it has a bigger discount (75% vs 50%)
  if (isDiscountHours && isComplexQuery) {
    return 'deepseek-reasoner';
  }
  
  // For complex reasoning tasks, use the reasoning model
  if (isComplexQuery) {
    return 'deepseek-reasoner';
  }
  
  // Default to the chat model for most queries as it's more cost-effective
  return 'deepseek-chat';
}

/**
 * Get the configuration for a specific model
 */
export function getModelConfig(modelType: ModelType) {
  return MODEL_CONFIG[modelType] || MODEL_CONFIG['deepseek-chat'];
}
