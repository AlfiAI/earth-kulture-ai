import { MessageProps } from '@/components/ai/Message';
import { aiContext } from '../context/aiContext';
import { deepseekR1Service } from '../deepseekR1Service';

/**
 * Conversation context handler for AI responses
 */
export class ConversationContextManager {
  private context = {
    recentTopics: [] as string[],
    userPreferences: {} as Record<string, any>,
    lastQuery: '',
    sessionStartTime: new Date()
  };

  /**
   * Update conversation context for improved contextual understanding
   */
  async updateContext(query: string, messageHistory: MessageProps[]): Promise<void> {
    // Save the current query
    this.context.lastQuery = query;
    
    // Extract intent from the query - make sure to wait for the result
    const intent = await deepseekR1Service.categorizeIntent(query);
    
    // Update recent topics (keep last 5)
    this.context.recentTopics.unshift(intent);
    if (this.context.recentTopics.length > 5) {
      this.context.recentTopics.pop();
    }
    
    // Extract and update user preferences based on query and history
    if (query.toLowerCase().includes('prefer') || query.toLowerCase().includes('like')) {
      // Simple preference extraction, could be enhanced
      const preference = query.split(' ').slice(-1)[0].toLowerCase();
      this.context.userPreferences[preference] = true;
    }
    
    // Update global aiContext for potential future use
    aiContext.conversationMemory.recentTopics = this.context.recentTopics;
    aiContext.conversationMemory.userPreferences = this.context.userPreferences;
  }

  /**
   * Get the current conversation context
   */
  getContext() {
    return { ...this.context };
  }
}

/**
 * Process a user's query with appropriate context and model selection
 */
export const processUserQuery = async (
  query: string,
  conversationHistory: any[] = [],
  systemPrompt?: string
): Promise<string> => {
  try {
    // Choose the appropriate model based on query complexity
    const responsePromise = deepseekR1Service.processQuery(
      query,
      conversationHistory,
      systemPrompt
    );
    
    // Make sure we're properly awaiting the promise
    const response = await responsePromise;
    return response;
  } catch (error) {
    console.error("Error processing user query:", error);
    return "I'm sorry, I encountered an error processing your request. Please try again.";
  }
};

/**
 * Create a message object for user interactions
 */
export function createUserMessage(content: string): MessageProps {
  return {
    id: Date.now().toString(),
    content,
    sender: 'user',
    timestamp: new Date(),
  };
}

/**
 * Create a message object for AI responses
 */
export function createAIMessage(content: string): MessageProps {
  return {
    id: Date.now().toString(),
    content,
    sender: 'ai',
    timestamp: new Date(),
  };
}

/**
 * Get default welcome message
 */
export function getWelcomeMessage(): MessageProps {
  return {
    id: '1',
    content: "Hello! I'm Waly, your ESG & Carbon Intelligence Assistant. I can help with sustainability reporting, carbon footprint analysis, ESG compliance, and more. How can I assist you today?",
    sender: 'ai',
    timestamp: new Date(),
  };
}

/**
 * Get enhanced welcome message for pro users
 */
export function getEnhancedWelcomeMessage(): MessageProps {
  return {
    id: '1',
    content: "Hello! I'm Waly Pro, your enhanced ESG & Carbon Intelligence Assistant. I now offer advanced benchmarking, predictive analytics, and industry comparisons. How can I assist you today?",
    sender: 'ai',
    timestamp: new Date(),
  };
}
