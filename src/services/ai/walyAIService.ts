
import { toast } from "sonner";
import { MessageProps } from '@/components/ai/Message';
import { deepseekR1Service } from './deepseekR1Service';
import { legacyProcessQuery } from './processors/legacyProcessor';
import { 
  ConversationContextManager, 
  createUserMessage, 
  createAIMessage,
  getWelcomeMessage,
  getEnhancedWelcomeMessage
} from './utils/conversationUtils';

// Re-export aiContext for other modules
export { aiContext } from './context/aiContext';

export class WalyAIService {
  // Track conversation context for improved responses
  private contextManager = new ConversationContextManager();

  // Enhanced AI processing function using DeepSeek R1 API
  async processQuery(query: string, messageHistory: MessageProps[] = []): Promise<string> {
    try {
      // Update conversation context
      this.contextManager.updateContext(query, messageHistory);
      
      // Process the query using DeepSeek R1 API
      const response = await deepseekR1Service.processQuery(query, messageHistory);
      return response;
    } catch (error) {
      console.error('Error processing query with DeepSeek R1:', error);
      
      // Fallback to legacy processing
      return legacyProcessQuery(query);
    }
  }

  // Create a message object
  createUserMessage(content: string): MessageProps {
    return createUserMessage(content);
  }

  createAIMessage(content: string): MessageProps {
    return createAIMessage(content);
  }

  // Get default welcome message
  getWelcomeMessage(): MessageProps {
    return getWelcomeMessage();
  }
  
  // Get enhanced welcome message
  getEnhancedWelcomeMessage(): MessageProps {
    return getEnhancedWelcomeMessage();
  }
}

export const walyAIService = new WalyAIService();
