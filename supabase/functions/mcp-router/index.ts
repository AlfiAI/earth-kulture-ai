
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "../utils.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Restricted words for basic content filtering
const RESTRICTED_WORDS = [
  "offensive", "explicit", "harmful", "illegal", "violent"
];

// AI model options
const AI_MODELS = {
  DEFAULT: "gpt-4o-mini",
  ADVANCED: "gpt-4o",
};

// Threshold rules for model selection
const MODEL_SELECTION_RULES = {
  PROMPT_LENGTH_THRESHOLD: 100, // Characters
  COMPLEXITY_THRESHOLD: 0.7,    // 0-1 scale
  PRIORITY_USERS: ["admin", "premium"], // User roles that get advanced models
};

// Maximum history messages to include in context
const MAX_CONTEXT_MESSAGES = 5;

// Context expiration time in milliseconds (30 minutes)
const CONTEXT_EXPIRATION_MS = 30 * 60 * 1000;

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL_MS = 5 * 60 * 1000;

// In-memory context cache (in production, this would be Redis/database backed)
const sessionContextCache = new Map();

// In-memory response cache
const responseCache = new Map();

// Function to calculate prompt complexity
function calculateComplexity(prompt: string): number {
  // This is a simplified complexity calculation
  // In production, this could use more sophisticated NLP metrics
  
  // Factors that might indicate complexity:
  // 1. Sentence length and variation
  // 2. Vocabulary diversity
  // 3. Use of technical terms
  // 4. Question complexity
  
  const words = prompt.split(/\s+/);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  
  // Ratio of unique words to total words indicates vocabulary diversity
  const lexicalDiversity = uniqueWords.size / words.length;
  
  // Average word length as a rough proxy for complexity
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  
  // Normalize to 0-1 scale
  const lengthFactor = Math.min(1, prompt.length / 500);
  const wordLengthFactor = Math.min(1, avgWordLength / 8);
  
  // Combined complexity score
  return (lexicalDiversity * 0.4) + (wordLengthFactor * 0.3) + (lengthFactor * 0.3);
}

// Validate prompt for problematic content
function validatePrompt(prompt: string): { valid: boolean; reason?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, reason: "Empty prompt" };
  }
  
  // Check for restricted words (basic implementation)
  const lowerPrompt = prompt.toLowerCase();
  for (const word of RESTRICTED_WORDS) {
    if (lowerPrompt.includes(word)) {
      return { 
        valid: false, 
        reason: `Prompt contains restricted content: ${word}` 
      };
    }
  }
  
  return { valid: true };
}

// Select the appropriate AI model based on the request
function selectModel(
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

// Get user session context, create if it doesn't exist
function getOrCreateSessionContext(sessionId: string, userId: string): any {
  // Clean expired sessions first
  cleanExpiredSessions();
  
  // Check if session exists
  if (sessionContextCache.has(sessionId)) {
    const context = sessionContextCache.get(sessionId);
    // Update last accessed time
    context.lastAccessed = Date.now();
    return context;
  }
  
  // Create new session context
  const newContext = {
    sessionId,
    userId,
    messages: [],
    topics: [],
    lastAccessed: Date.now(),
    created: Date.now()
  };
  
  sessionContextCache.set(sessionId, newContext);
  return newContext;
}

// Clean expired sessions from memory
function cleanExpiredSessions(): void {
  const now = Date.now();
  
  for (const [sessionId, context] of sessionContextCache.entries()) {
    if (now - context.lastAccessed > CONTEXT_EXPIRATION_MS) {
      sessionContextCache.delete(sessionId);
    }
  }
}

// Generate a cache key based on prompt and context
function generateCacheKey(prompt: string, sessionId: string): string {
  return `${sessionId}:${prompt}`;
}

// Check if a cached response exists and is valid
function getCachedResponse(prompt: string, sessionId: string): any {
  const cacheKey = generateCacheKey(prompt, sessionId);
  
  if (responseCache.has(cacheKey)) {
    const cached = responseCache.get(cacheKey);
    
    // Check if cache is still valid
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.response;
    }
    
    // Remove expired cache entry
    responseCache.delete(cacheKey);
  }
  
  return null;
}

// Add response to cache
function cacheResponse(prompt: string, sessionId: string, response: any): void {
  const cacheKey = generateCacheKey(prompt, sessionId);
  
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now()
  });
}

// Extract topics or key entities from a prompt
function extractTopics(prompt: string): string[] {
  // Simple topic extraction logic
  // In production, this would use more sophisticated NLP techniques
  
  const words = prompt.toLowerCase().split(/\s+/);
  const stopWords = new Set(["the", "and", "or", "a", "an", "in", "on", "at", "by", "for", "with", "about", "to", "of"]);
  
  return words
    .filter(word => word.length > 4 && !stopWords.has(word))
    .slice(0, 3);
}

// Summarize conversation context for inclusion in prompts
function summarizeContext(context: any): string {
  if (!context || context.messages.length === 0) {
    return "";
  }
  
  const recentMessages = context.messages.slice(-MAX_CONTEXT_MESSAGES);
  let summary = "Previous conversation context:\n";
  
  recentMessages.forEach((msg: any, index: number) => {
    summary += `${index + 1}. ${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}\n`;
  });
  
  if (context.topics.length > 0) {
    summary += `\nRelevant topics: ${context.topics.join(', ')}`;
  }
  
  return summary;
}

// Update session context with new message
function updateSessionContext(context: any, role: string, content: string): void {
  // Add message to context
  context.messages.push({
    role,
    content,
    timestamp: Date.now()
  });
  
  // Limit context size to prevent excessive memory usage
  if (context.messages.length > MAX_CONTEXT_MESSAGES * 2) {
    context.messages = context.messages.slice(-MAX_CONTEXT_MESSAGES);
  }
  
  // If user message, extract and update topics
  if (role === 'user') {
    const newTopics = extractTopics(content);
    
    // Add new topics to existing ones, avoiding duplicates
    newTopics.forEach(topic => {
      if (!context.topics.includes(topic)) {
        context.topics.push(topic);
      }
    });
    
    // Limit topics to most recent/relevant
    if (context.topics.length > 10) {
      context.topics = context.topics.slice(-10);
    }
  }
  
  // Update last accessed time
  context.lastAccessed = Date.now();
}

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
