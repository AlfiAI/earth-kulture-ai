
// Import constants and configurations
import { AI_MODELS, MODEL_SELECTION_RULES } from './config.ts';

// Track API failures to determine if we should switch to local AI
let apiFailureCount = 0;

export function trackAPIFailure(failed: boolean) {
  apiFailureCount = failed ? apiFailureCount + 1 : 0;
}

// Data structure to store model selection reasons
type ModelSelectionReason = 
  | 'user_requested' 
  | 'complexity' 
  | 'priority_user' 
  | 'cost_effective' 
  | 'api_failure' 
  | 'eco_friendly';

interface ModelSelection {
  model: string;
  reason: ModelSelectionReason;
  useLocalAI: boolean;
}

/**
 * Select the appropriate model based on various factors
 */
export async function selectModel(
  prompt: string, 
  userRole: string, 
  modelRequested?: string,
  manualOverride = false,
  sessionContext?: any
): Promise<ModelSelection> {
  
  // Override with requested model if specified and manual override is enabled
  if (modelRequested && manualOverride) {
    return {
      model: modelRequested,
      reason: 'user_requested',
      useLocalAI: modelRequested === AI_MODELS.LOCAL
    };
  }
  
  // Check if we should use local AI due to API failures
  if (apiFailureCount >= MODEL_SELECTION_RULES.API_FALLBACK_THRESHOLD) {
    console.log(`Using local AI due to ${apiFailureCount} consecutive API failures`);
    return {
      model: AI_MODELS.LOCAL,
      reason: 'api_failure',
      useLocalAI: true
    };
  }
  
  // Estimate prompt complexity
  const complexity = estimateComplexity(prompt, sessionContext);
  console.log(`Estimated complexity: ${complexity}`);
  
  // Priority users get advanced model for complex queries
  if (
    MODEL_SELECTION_RULES.PRIORITY_USERS.includes(userRole) && 
    complexity > MODEL_SELECTION_RULES.COMPLEXITY_THRESHOLD
  ) {
    return {
      model: AI_MODELS.ADVANCED,
      reason: 'priority_user',
      useLocalAI: false
    };
  }
  
  // Use local AI for simpler queries to save costs and improve performance
  if (complexity < MODEL_SELECTION_RULES.LOCAL_COMPLEXITY_THRESHOLD) {
    // Use Mistral energy-efficient model for simple queries
    return {
      model: "mistral-small",
      reason: 'eco_friendly',
      useLocalAI: false
    };
  }
  
  // For more complex queries, use appropriate model based on complexity
  if (complexity > MODEL_SELECTION_RULES.COMPLEXITY_THRESHOLD) {
    return {
      model: AI_MODELS.ADVANCED,
      reason: 'complexity',
      useLocalAI: false
    };
  }
  
  // Default to the most cost-effective model
  return {
    model: "mistral-tiny", // Use energy-efficient model by default
    reason: 'eco_friendly',
    useLocalAI: false
  };
}

/**
 * Estimate the complexity of a prompt
 */
function estimateComplexity(prompt: string, sessionContext?: any): number {
  let complexity = 0;
  
  // Length-based complexity
  complexity += Math.min(0.5, prompt.length / 1000);
  
  // Keyword-based complexity
  const complexityKeywords = [
    'analyze', 'compare', 'explain', 'why', 'how', 'difference',
    'impact', 'implications', 'relationship', 'technical', 'complex',
    'detailed', 'data', 'research', 'evidence', 'recommendation'
  ];
  
  let keywordMatches = 0;
  complexityKeywords.forEach(keyword => {
    if (prompt.toLowerCase().includes(keyword)) {
      keywordMatches++;
    }
  });
  
  complexity += keywordMatches * 0.05;
  
  // Context-based complexity
  if (sessionContext && sessionContext.messages) {
    complexity += Math.min(0.3, sessionContext.messages.length * 0.03);
  }
  
  return Math.min(1, complexity);
}
