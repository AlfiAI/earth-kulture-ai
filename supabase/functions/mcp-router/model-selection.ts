
import { AI_MODELS, MODEL_SELECTION_RULES } from './config.ts';
import { calculateComplexity } from './validation.ts';

// Select the appropriate AI model based on the request
export function selectModel(
  prompt: string, 
  userRole: string = "standard", 
  requestedModel?: string, 
  manualOverride = false,
  conversationContext?: any
): { model: string; reason: string; } {
  // If manual override is enabled and a specific model is requested, use that
  if (manualOverride && requestedModel) {
    return { 
      model: requestedModel, 
      reason: "Manual override" 
    };
  }
  
  // Priority users get the advanced model by default
  if (MODEL_SELECTION_RULES.PRIORITY_USERS.includes(userRole)) {
    return { 
      model: AI_MODELS.ADVANCED, 
      reason: "Priority user" 
    };
  }
  
  // Calculate prompt complexity
  const complexity = calculateComplexity(prompt);
  
  // For multi-turn conversations with context, use the advanced model
  if (conversationContext && conversationContext.messages.length > 3) {
    return {
      model: AI_MODELS.ADVANCED,
      reason: "Multi-turn conversation with significant context"
    };
  }
  
  // Check prompt length and complexity
  if (
    prompt.length > MODEL_SELECTION_RULES.PROMPT_LENGTH_THRESHOLD || 
    complexity > MODEL_SELECTION_RULES.COMPLEXITY_THRESHOLD
  ) {
    return { 
      model: AI_MODELS.ADVANCED, 
      reason: `Complex query (score: ${complexity.toFixed(2)})` 
    };
  }
  
  // Default to the basic model
  return { 
    model: AI_MODELS.DEFAULT, 
    reason: "Standard query" 
  };
}
