
import { MessageProps } from '@/components/ai/Message';
import { WalyAIServiceInterface } from './types/walyAITypes';
import { ConversationContextManager } from './utils/conversationContextManager';
import { processQuery } from './processors/queryProcessor';
import { messageFactory } from './utils/messageFactory';

/**
 * Implementation of the Waly AI Service
 */
export class WalyAIServiceImpl implements WalyAIServiceInterface {
  // Track conversation context for improved responses
  private contextManager = new ConversationContextManager();

  /**
   * Enhanced AI processing function using DeepSeek R1 API
   */
  async processQuery(query: string, messageHistory: MessageProps[] = []): Promise<string> {
    console.log('WalyAIServiceImpl processing query with history length:', messageHistory.length);
    // Update conversation context
    this.contextManager.updateContext(query, messageHistory);
    
    // Process the query with DeepSeek R1
    return processQuery(query, messageHistory);
  }

  /**
   * Create a user message object
   */
  createUserMessage(content: string): MessageProps {
    return messageFactory.createUserMessage(content);
  }

  /**
   * Create an AI message object
   */
  createAIMessage(content: string): MessageProps {
    return messageFactory.createAIMessage(content);
  }

  /**
   * Get default welcome message
   */
  getWelcomeMessage(): MessageProps {
    return messageFactory.getWelcomeMessage();
  }
  
  /**
   * Get enhanced welcome message
   */
  getEnhancedWelcomeMessage(): MessageProps {
    return messageFactory.getEnhancedWelcomeMessage();
  }
}
