
import { AI_MODELS, MODEL_SELECTION_RULES, HYBRID_AI_CONFIG } from './config.ts';
import { calculateComplexity } from './validation.ts';
import { isLocalAIAvailable } from './local-ai-processor.ts';

// Counters for API fallback mechanism
let apiFailureCount = 0;
let localAIAvailabilityCache: { available: boolean; timestamp: number } | null = null;

// Select the appropriate AI model based on the request
export async function selectModel(
  prompt: string, 
  userRole: string = "standard", 
  requestedModel?: string, 
  manualOverride = false,
  conversationContext?: any
): Promise<{ model: string; reason: string; useLocalAI: boolean }> {
  // If manual override is enabled and a specific model is requested, use that
  if (manualOverride && requestedModel) {
    return { 
      model: requestedModel, 
      reason: "Manual override",
      useLocalAI: false
    };
  }
  
  // Check if we should use local AI due to API failures
  if (HYBRID_AI_CONFIG.ENABLED && apiFailureCount >= HYBRID_AI_CONFIG.API_FALLBACK_THRESHOLD) {
    // Check if local AI is available (caching for 5 minutes)
    if (!localAIAvailabilityCache || (Date.now() - localAIAvailabilityCache.timestamp > 5 * 60 * 1000)) {
      const available = await isLocalAIAvailable();
      localAIAvailabilityCache = { available, timestamp: Date.now() };
    }
    
    if (localAIAvailabilityCache.available) {
      return {
        model: AI_MODELS.LOCAL,
        reason: "Using local AI due to API fallback threshold reached",
        useLocalAI: true
      };
    }
  }
  
  // Priority users get the advanced model by default
  if (MODEL_SELECTION_RULES.PRIORITY_USERS.includes(userRole)) {
    return { 
      model: AI_MODELS.ADVANCED, 
      reason: "Priority user",
      useLocalAI: false
    };
  }
  
  // Calculate prompt complexity
  const complexity = calculateComplexity(prompt);
  
  // For hybrid processing, check if we can use local AI
  if (HYBRID_AI_CONFIG.ENABLED && complexity <= MODEL_SELECTION_RULES.LOCAL_COMPLEXITY_THRESHOLD) {
    // Check if local AI is available (use cache if available)
    if (!localAIAvailabilityCache || (Date.now() - localAIAvailabilityCache.timestamp > 5 * 60 * 1000)) {
      const available = await isLocalAIAvailable();
      localAIAvailabilityCache = { available, timestamp: Date.now() };
    }
    
    if (localAIAvailabilityCache.available) {
      return {
        model: AI_MODELS.LOCAL,
        reason: `Low complexity query (score: ${complexity.toFixed(2)}) suitable for local processing`,
        useLocalAI: true
      };
    }
  }
  
  // For multi-turn conversations with context, use the advanced model
  if (conversationContext && conversationContext.messages.length > 3) {
    return {
      model: AI_MODELS.ADVANCED,
      reason: "Multi-turn conversation with significant context",
      useLocalAI: false
    };
  }
  
  // Check prompt length and complexity
  if (
    prompt.length > MODEL_SELECTION_RULES.PROMPT_LENGTH_THRESHOLD || 
    complexity > MODEL_SELECTION_RULES.COMPLEXITY_THRESHOLD
  ) {
    return { 
      model: AI_MODELS.ADVANCED, 
      reason: `Complex query (score: ${complexity.toFixed(2)})`,
      useLocalAI: false
    };
  }
  
  // Default to the basic model
  return { 
    model: AI_MODELS.DEFAULT, 
    reason: "Standard query",
    useLocalAI: false
  };
}

/**
 * Track API failures to trigger fallback to local AI
 */
export function trackAPIFailure(failed: boolean): void {
  if (failed) {
    apiFailureCount++;
    console.log(`API failure count: ${apiFailureCount}`);
  } else {
    // Reset counter on successful API call
    apiFailureCount = 0;
  }
}
