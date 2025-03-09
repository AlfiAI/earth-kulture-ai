
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "../utils.ts";
import { corsHeaders } from './config.ts';
import { validatePrompt } from './validation.ts';
import { selectModel, trackAPIFailure } from './model-selection.ts';
import { processLocalAI } from './local-ai-processor.ts';
import { 
  getOrCreateSessionContext, 
  updateSessionContext, 
  summarizeContext 
} from './context.ts';
import { 
  getCachedResponse, 
  cacheResponse, 
  generateCacheKey 
} from './cache.ts';

// Main handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get environment variables
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
    
    // Parse request body
    const { prompt, modelRequested, manualOverride, userId, sessionId = userId } = await req.json();
    
    // Start timer for performance tracking
    const startTime = Date.now();
    
    // Validate the prompt
    const validation = validatePrompt(prompt);
    if (!validation.valid) {
      // Log the invalid request
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      await supabase.from('ai_requests').insert({
        user_id: userId,
        prompt: prompt || "",
        model_requested: modelRequested,
        model_used: "none",
        manual_override: Boolean(manualOverride),
        status: "rejected",
        error_message: validation.reason,
        processing_time_ms: Date.now() - startTime,
        metadata: { validation_error: validation.reason }
      });
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: validation.reason 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
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
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      await supabase.from('ai_requests').insert({
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
      
      return new Response(
        JSON.stringify({
          success: true,
          result: cachedResponse.text,
          model: cachedResponse.model,
          reason: cachedResponse.reason,
          processingTime: 0,
          tokens: cachedResponse.tokens,
          fromCache: true
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
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
    
    // Log the request to Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
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
    await supabase.from('ai_requests').insert({
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
    
    // Return the response
    return new Response(
      JSON.stringify({
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
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Track API failure
    trackAPIFailure(true);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Server error: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
