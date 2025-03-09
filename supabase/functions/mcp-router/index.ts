
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "../utils.ts";
import { corsHeaders } from './config.ts';
import { validatePrompt, calculateComplexity } from './validation.ts';
import { selectModel } from './model-selection.ts';
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
          complexity_score: calculateComplexity(prompt),
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
    const modelSelection = selectModel(prompt, userRole, modelRequested, Boolean(manualOverride), sessionContext);
    
    // Add the new user message to context
    updateSessionContext(sessionContext, 'user', prompt);
    
    // Prepare context summary for the AI request
    const contextSummary = summarizeContext(sessionContext);
    console.log("Context summary:", contextSummary);
    
    // Log the request to Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // For this example, we'll just log the request without actually calling an AI API
    // In a real implementation, you would now call the selected AI model's API
    // and include the contextSummary in the prompt
    
    const processingTime = Date.now() - startTime;
    
    // Mock response data (would come from the AI model in a real implementation)
    const mockResponse = {
      text: `Your request was processed by ${modelSelection.model}. ${contextSummary ? "I've taken our conversation history into account." : ""}`,
      model: modelSelection.model,
      reason: modelSelection.reason,
      tokens: Math.floor((prompt.length + (contextSummary ? contextSummary.length : 0)) / 4), // Just a mock calculation
    };
    
    // Add the AI response to context
    updateSessionContext(sessionContext, 'assistant', mockResponse.text);
    
    // Cache the response for future similar requests
    cacheResponse(prompt, sessionId, mockResponse);
    
    // Log the successful request
    await supabase.from('ai_requests').insert({
      user_id: userId,
      prompt: prompt,
      model_requested: modelRequested,
      model_used: modelSelection.model,
      manual_override: Boolean(manualOverride),
      status: "completed",
      processing_time_ms: processingTime,
      tokens_used: mockResponse.tokens,
      metadata: { 
        selection_reason: modelSelection.reason,
        complexity_score: calculateComplexity(prompt),
        context_size: sessionContext.messages.length,
        topics: sessionContext.topics,
        session_id: sessionId
      }
    });
    
    // Return the response
    return new Response(
      JSON.stringify({
        success: true,
        result: mockResponse.text,
        model: mockResponse.model,
        reason: mockResponse.reason,
        processingTime: processingTime,
        tokens: mockResponse.tokens,
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
