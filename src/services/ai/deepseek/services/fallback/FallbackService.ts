
/**
 * FallbackService - Provides fallback responses when both cloud and local AI are unavailable
 */
import { generateFallbackResponse } from '../../utils/deepseekUtils';

export class FallbackService {
  /**
   * Generate fallback response when all other processing methods fail
   */
  getFallbackResponse(query: string): string {
    return generateFallbackResponse(query);
  }
}

export const fallbackService = new FallbackService();
