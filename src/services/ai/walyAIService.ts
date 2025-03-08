
import { WalyAIServiceImpl } from './waly/walyAIServiceImpl';

// Re-export aiContext for other modules
export { aiContext } from './context/aiContext';

// Create and export the WalyAIService instance
export const walyAIService = new WalyAIServiceImpl();

// Re-export types
export type { WalyAIServiceInterface } from './waly/types/walyAITypes';
