
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
  manualOverride = false
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
    const { prompt, modelRequested, manualOverride, userId } = await req.json();
    
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
    
    // Determine which model to use
    // In a real app, you'd get the user's role from Supabase auth
    const userRole = "standard"; // Placeholder, would get from auth
    const modelSelection = selectModel(prompt, userRole, modelRequested, Boolean(manualOverride));
    
    // Log the request to Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // For this example, we'll just log the request without actually calling an AI API
    // In a real implementation, you would now call the selected AI model's API
    
    const processingTime = Date.now() - startTime;
    
    // Mock response data (would come from the AI model in a real implementation)
    const mockResponse = {
      text: `Your request was processed by ${modelSelection.model}`,
      model: modelSelection.model,
      reason: modelSelection.reason,
      tokens: Math.floor(prompt.length / 4), // Just a mock calculation
    };
    
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
        complexity_score: calculateComplexity(prompt)
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
        tokens: mockResponse.tokens
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
