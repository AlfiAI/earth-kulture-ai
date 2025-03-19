
/**
 * Enhanced model selection utilities with energy efficiency considerations
 */
import { ModelType } from '../types/deepseekTypes';
import { MODEL_CONFIG, ENABLE_ECO_MODE_BY_DEFAULT } from '../constants/deepseekConstants';

/**
 * Determine the best model to use based on query complexity, time of day (pricing), 
 * and energy efficiency considerations
 */
export function determineModelForQuery(
  query: string, 
  conversationContext: any[] = [],
  ecoMode: boolean = ENABLE_ECO_MODE_BY_DEFAULT
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
  
  const isVerySimpleQuery =
    query.length < 50 &&
    !isComplexQuery &&
    conversationContext.length <= 2;
    
  // Get daily carbon usage from local storage
  const today = new Date().toISOString().split('T')[0];
  const dailyCarbonUsageStr = localStorage.getItem(`carbonUsage_${today}`);
  const dailyCarbonUsage = dailyCarbonUsageStr ? parseFloat(dailyCarbonUsageStr) : 0;
  
  // Energy-efficient model selection
  if (ecoMode) {
    if (isVerySimpleQuery) {
      return 'mistral-tiny';
    } else if (!isComplexQuery) {
      return 'mistral-small';
    } else {
      return 'mistral-large';
    }
  }
  
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
  return MODEL_CONFIG[modelType] || MODEL_CONFIG['mistral-small'];
}

/**
 * Track carbon usage for the model
 */
export function trackModelCarbonUsage(model: ModelType, tokenCount: number): void {
  const config = getModelConfig(model);
  const carbonFootprint = config.energyEfficiency?.carbonFootprint || 0;
  
  // Calculate carbon usage based on tokens processed
  const carbonUsage = (carbonFootprint * tokenCount) / 1000;
  
  // Store in local storage by date
  const today = new Date().toISOString().split('T')[0];
  const currentUsageStr = localStorage.getItem(`carbonUsage_${today}`);
  const currentUsage = currentUsageStr ? parseFloat(currentUsageStr) : 0;
  
  localStorage.setItem(`carbonUsage_${today}`, (currentUsage + carbonUsage).toString());
  
  console.log(`Carbon usage tracked: ${carbonUsage.toFixed(4)} gCO2e for model ${model}`);
}

/**
 * Get energy efficiency information for a model
 */
export function getModelEnergyInfo(model: ModelType) {
  const config = getModelConfig(model);
  return config.energyEfficiency || {
    carbonFootprint: 1.0,
    energyUsage: 0.001,
    isEcoFriendly: false
  };
}

/**
 * Get the total carbon footprint for today's usage
 */
export function getTodayCarbonFootprint(): number {
  const today = new Date().toISOString().split('T')[0];
  const usageStr = localStorage.getItem(`carbonUsage_${today}`);
  return usageStr ? parseFloat(usageStr) : 0;
}
