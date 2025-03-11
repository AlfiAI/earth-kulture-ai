/**
 * Utility functions for the DeepSeek API
 */

/**
 * Hash a string into a reproducible identifier
 */
export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Format API response by cleaning and trimming
 */
export function formatAPIResponse(text: string): string {
  if (!text) return '';
  
  // Remove any markdown code block markers
  let cleanText = text.replace(/```[a-z]*\n/g, '').replace(/```/g, '');
  
  // Trim whitespace
  cleanText = cleanText.trim();
  
  return cleanText;
}

/**
 * Detect if local AI processing is available
 * In a real implementation, this would check for local LLM availability
 */
export async function detectLocalAIAvailability(): Promise<boolean> {
  // This is a placeholder for actual detection logic
  // In a real implementation, this would check if local AI models are available
  return false;
}

/**
 * Generate a fallback response for a query
 */
export function generateFallbackResponse(query: string): string {
  return `I'm sorry, I couldn't process your query: "${query}". Please try again later or contact support if the issue persists.`;
}
