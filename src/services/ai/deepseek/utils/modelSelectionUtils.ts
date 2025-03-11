import { 
  DEEPSEEK_MODELS, 
  PRICING_PERIODS, 
  MODEL_SELECTION_THRESHOLDS 
} from "../constants/deepseekConstants";

/**
 * Calculate query complexity score (0-1)
 */
export function calculateQueryComplexity(query: string): number {
  const lowerQuery = query.toLowerCase();
  
  // Complexity indicators
  const complexityIndicators = [
    // Reasoning patterns
    'why', 'how', 'explain', 'analyze', 'compare', 'difference', 'relationship',
    'impact', 'effect', 'cause', 'implications', 'evaluate',
    
    // Technical terminology
    'scope 3', 'emissions', 'ghg protocol', 'tcfd', 'science-based targets',
    'eu taxonomy', 'csrd', 'materiality', 'carbon intensity', 'benchmark',
    
    // Multi-step requests
    'step by step', 'process', 'strategy', 'plan', 'roadmap',
    'recommendation', 'optimize', 'improve', 'framework',
    
    // Complex questions
    'what if', 'scenario', 'projection', 'forecast', 'predict', 'future',
    'risk assessment', 'opportunity identification'
  ];
  
  // Count complexity indicators in the query
  let indicatorCount = 0;
  for (const indicator of complexityIndicators) {
    if (lowerQuery.includes(indicator)) {
      indicatorCount++;
    }
  }
  
  // Base complexity score
  let complexityScore = Math.min(indicatorCount / 10, 0.7);
  
  // Adjust for query length (longer queries are generally more complex)
  if (query.length > 200) {
    complexityScore += 0.1;
  }
  if (query.length > 500) {
    complexityScore += 0.1;
  }
  
  // Adjust for question marks (more questions = more complexity)
  const questionMarkCount = (query.match(/\?/g) || []).length;
  if (questionMarkCount > 2) {
    complexityScore += 0.1;
  }
  
  return Math.min(complexityScore, 1.0);
}

/**
 * Check if current time is in discount period
 */
export function isDiscountPeriod(): boolean {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const currentTimeInUTC = utcHours + (utcMinutes / 60);
  
  const { DISCOUNT } = PRICING_PERIODS;
  
  // Handle the special case where discount period crosses midnight
  if (DISCOUNT.start > DISCOUNT.end) {
    return currentTimeInUTC >= DISCOUNT.start || currentTimeInUTC < DISCOUNT.end;
  }
  
  // Normal case
  return currentTimeInUTC >= DISCOUNT.start && currentTimeInUTC < DISCOUNT.end;
}

/**
 * Get context-aware model configuration
 */
export function getModelConfiguration(
  query: string, 
  forcedModel?: string, 
  requiresReasoning: boolean = false,
  contextSize: number = 1
): {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  reason: string;
} {
  // If model is forced, use it
  if (forcedModel && Object.values(DEEPSEEK_MODELS).includes(forcedModel)) {
    return {
      model: forcedModel,
      temperature: forcedModel === DEEPSEEK_MODELS.REASONER ? 0.5 : 0.7,
      max_tokens: MODEL_SELECTION_THRESHOLDS.MAX_TOKENS_OUTPUT.STANDARD,
      top_p: 0.95,
      reason: "User-specified model"
    };
  }
  
  // Check if query requires reasoning capabilities
  const queryComplexity = calculateQueryComplexity(query);
  
  // Select model based on complexity and other factors
  const isComplex = queryComplexity > MODEL_SELECTION_THRESHOLDS.COMPLEXITY || requiresReasoning;
  const isDiscount = isDiscountPeriod();
  
  // Complex queries during discount period always use REASONER
  if (isComplex && isDiscount) {
    return {
      model: DEEPSEEK_MODELS.REASONER,
      temperature: 0.5, // Lower temperature for more precise reasoning
      max_tokens: MODEL_SELECTION_THRESHOLDS.MAX_TOKENS_OUTPUT.STANDARD,
      top_p: 0.95,
      reason: "Complex query during discount period - using Reasoner model"
    };
  }
  
  // Complex queries during standard period - cost-benefit analysis
  if (isComplex) {
    // For very complex queries or when explicit reasoning is required, use REASONER
    if (queryComplexity > 0.85 || requiresReasoning) {
      return {
        model: DEEPSEEK_MODELS.REASONER,
        temperature: 0.5,
        max_tokens: MODEL_SELECTION_THRESHOLDS.MAX_TOKENS_OUTPUT.STANDARD,
        top_p: 0.95,
        reason: "Highly complex query - using Reasoner model"
      };
    }
    // Otherwise, use standard model for cost efficiency
    return {
      model: DEEPSEEK_MODELS.STANDARD,
      temperature: 0.6, // Slightly lower temperature for more precise results
      max_tokens: MODEL_SELECTION_THRESHOLDS.MAX_TOKENS_OUTPUT.STANDARD,
      top_p: 0.95,
      reason: "Moderately complex query - using Standard model for cost efficiency"
    };
  }
  
  // Simple queries during discount period - consider REASONER for better quality
  if (isDiscount && contextSize > 3) {
    return {
      model: DEEPSEEK_MODELS.REASONER,
      temperature: 0.6,
      max_tokens: MODEL_SELECTION_THRESHOLDS.MAX_TOKENS_OUTPUT.STANDARD,
      top_p: 0.95,
      reason: "Multi-turn conversation during discount period - using Reasoner model"
    };
  }
  
  // Default to STANDARD model for simple queries
  return {
    model: DEEPSEEK_MODELS.STANDARD,
    temperature: 0.7,
    max_tokens: MODEL_SELECTION_THRESHOLDS.MAX_TOKENS_OUTPUT.STANDARD,
    top_p: 0.95,
    reason: "Standard query complexity - using Standard model"
  };
}
