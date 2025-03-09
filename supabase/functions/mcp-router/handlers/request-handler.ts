
import { corsHeaders } from '../config.ts';
import { validatePrompt } from '../validation.ts';
import { processAIRequest } from './process-ai-request.ts';
import { formatSuccessResponse, formatErrorResponse } from './response-formatter.ts';
import { logRequest } from '../logging.ts';
import { createClient } from '../../utils.ts';

/**
 * Process an incoming AI request
 */
export async function handleAIRequest(req: Request) {
  // Start timer for performance tracking
  const startTime = Date.now();
  
  try {
    // Get environment variables
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
    
    // Parse request body
    const { prompt, modelRequested, manualOverride, userId, sessionId = userId } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Validate the prompt
    const validation = validatePrompt(prompt);
    if (!validation.valid) {
      // Log the invalid request
      await logRequest(supabase, {
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
      
      return formatErrorResponse(validation.reason, 400);
    }
    
    // Process the AI request
    const result = await processAIRequest({
      prompt,
      userId,
      sessionId,
      modelRequested,
      manualOverride,
      startTime,
      supabase
    });
    
    return formatSuccessResponse(result);
    
  } catch (error) {
    console.error("Error processing request:", error);
    return formatErrorResponse(`Server error: ${error.message}`, 500);
  }
}
