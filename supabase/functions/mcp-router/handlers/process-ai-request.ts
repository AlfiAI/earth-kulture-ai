
import { 
  getOrCreateSessionContext, 
  updateSessionContext, 
  summarizeContext 
} from '../context.ts';
import { 
  getCachedResponse, 
  cacheResponse, 
  generateCacheKey 
} from '../cache.ts';
import { selectModel } from '../model-selection.ts';
import { processLocalAI } from '../local-ai-processor.ts';
import { trackAPIFailure } from '../model-selection.ts';
import { logRequest } from '../logging.ts';

interface AIRequestParams {
  prompt: string;
  userId: string;
  sessionId: string;
  modelRequested?: string;
  manualOverride?: boolean;
  startTime: number;
  supabase: any;
}

/**
 * Process an AI request using the appropriate model
 */
export async function processAIRequest({
  prompt,
  userId,
  sessionId,
  modelRequested,
  manualOverride = false,
  startTime,
  supabase
}: AIRequestParams) {
  // Get or create session context
  const sessionContext = getOrCreateSessionContext(sessionId, userId);
  
  // Check if we have a cached response for this prompt
  const cachedResponse = getCachedResponse(prompt, sessionId);
  if (cachedResponse) {
    console.log("Using cached response for prompt:", prompt.substring(0, 30) + "...");
    
    // Update session context with this interaction
    updateSessionContext(sessionContext, 'user', prompt);
    updateSessionContext(sessionContext, 'assistant', cachedResponse.text);
    
    // Log the cached request
    await logRequest(supabase, {
      user_id: userId,
      prompt: prompt,
      model_requested: modelRequested,
      model_used: cachedResponse.model,
      manual_override: Boolean(manualOverride),
      status: "completed",
      processing_time_ms: 0, // Cached response has zero processing time
      tokens_used: cachedResponse.tokens,
      metadata: { 
        from_cache: true,
        cache_key: generateCacheKey(prompt, sessionId),
        selection_reason: cachedResponse.reason,
        context_size: sessionContext.messages.length
      }
    });
    
    return {
      success: true,
      result: cachedResponse.text,
      model: cachedResponse.model,
      reason: cachedResponse.reason,
      processingTime: 0,
      tokens: cachedResponse.tokens,
      fromCache: true
    };
  }
  
  // Determine which model to use
  // In a real app, you'd get the user's role from Supabase auth
  const userRole = "standard"; // Placeholder, would get from auth
  const modelSelection = await selectModel(prompt, userRole, modelRequested, Boolean(manualOverride), sessionContext);
  
  // Add the new user message to context
  updateSessionContext(sessionContext, 'user', prompt);
  
  // Prepare context summary for the AI request
  const contextSummary = summarizeContext(sessionContext);
  console.log("Context summary:", contextSummary);
  
  // Process the request with the appropriate model
  let aiResponse;
  let apiError = false;
  
  if (modelSelection.useLocalAI) {
    // Process with local AI model
    console.log("Processing with local AI model");
    
    // Create a system prompt that includes context
    const systemPrompt = `You are Waly, an ESG & Carbon Intelligence Assistant specialized in sustainability. ${
      contextSummary ? `This is a continuing conversation. Context: ${contextSummary}` : ""
    }`;
    
    const localResponse = await processLocalAI(prompt, systemPrompt);
    
    if (localResponse.error) {
      console.error("Local AI processing error:", localResponse.error);
      // Fall back to cloud API
      apiError = true;
    } else {
      aiResponse = {
        text: localResponse.text,
        model: "local:" + modelSelection.model,
        reason: modelSelection.reason,
        tokens: Math.floor(localResponse.text.length / 4), // Just a rough estimate
      };
    }
  }
  
  if (!modelSelection.useLocalAI || apiError) {
    // Log errors but continue with mock response for now
    // In a real implementation, you would call the selected AI model's API
    // and include the contextSummary in the prompt
    
    const processingTime = Date.now() - startTime;
    
    // Mock response data (would come from the AI model in a real implementation)
    aiResponse = {
      text: `Your request was processed by ${modelSelection.model}. ${contextSummary ? "I've taken our conversation history into account." : ""}`,
      model: modelSelection.model,
      reason: modelSelection.reason,
      tokens: Math.floor((prompt.length + (contextSummary ? contextSummary.length : 0)) / 4), // Just a mock calculation
    };
    
    // Track API success
    trackAPIFailure(false);
  }
  
  // Add the AI response to context
  updateSessionContext(sessionContext, 'assistant', aiResponse.text);
  
  // Cache the response for future similar requests
  cacheResponse(prompt, sessionId, aiResponse);
  
  const processingTime = Date.now() - startTime;
  
  // Log the successful request
  await logRequest(supabase, {
    user_id: userId,
    prompt: prompt,
    model_requested: modelRequested,
    model_used: aiResponse.model,
    manual_override: Boolean(manualOverride),
    status: "completed",
    processing_time_ms: processingTime,
    tokens_used: aiResponse.tokens,
    metadata: { 
      selection_reason: aiResponse.reason,
      context_size: sessionContext.messages.length,
      topics: sessionContext.topics,
      session_id: sessionId,
      used_local_ai: modelSelection.useLocalAI
    }
  });
  
  return {
    success: true,
    result: aiResponse.text,
    model: aiResponse.model,
    reason: aiResponse.reason,
    processingTime: processingTime,
    tokens: aiResponse.tokens,
    usedLocalAI: modelSelection.useLocalAI,
    context: {
      messageCount: sessionContext.messages.length,
      topics: sessionContext.topics
    }
  };
}
