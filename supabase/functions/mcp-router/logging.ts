
/**
 * Log an AI request to the database
 */
export async function logRequest(supabase: any, requestData: {
  user_id: string;
  prompt: string;
  model_requested?: string;
  model_used: string;
  manual_override: boolean;
  status: string;
  processing_time_ms: number;
  tokens_used?: number;
  error_message?: string;
  metadata?: any;
}) {
  try {
    await supabase.from('ai_requests').insert(requestData);
  } catch (error) {
    console.error("Error logging request:", error);
    // Non-blocking - we don't want logging errors to affect the response
  }
}
