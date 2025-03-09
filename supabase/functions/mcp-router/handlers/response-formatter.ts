
import { corsHeaders } from '../config.ts';
import { trackAPIFailure } from '../model-selection.ts';

/**
 * Format a successful response
 */
export function formatSuccessResponse(data: any) {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Format an error response
 */
export function formatErrorResponse(message: string, status: number = 500) {
  // Track API failure for fallback mechanism if this is a server error
  if (status >= 500) {
    trackAPIFailure(true);
  }
  
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: message
    }),
    { 
      status, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}
