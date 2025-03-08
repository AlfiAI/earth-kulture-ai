import { ConversationContext } from '../types/walyAITypes';
import { MessageProps } from '@/components/ai/Message';

/**
 * Manages conversation context for improved AI responses
 */
export class ConversationContextManager {
  private context: ConversationContext = {
    recentQueries: [],
    userPreferences: {},
    lastUpdated: new Date()
  };

  /**
   * Update conversation context based on new query and message history
   */
  updateContext(query: string, messageHistory: MessageProps[] = []): void {
    // Add query to recent queries (keep only the last 5)
    this.context.recentQueries = [query, ...this.context.recentQueries.slice(0, 4)];
    
    // Update timestamp
    this.context.lastUpdated = new Date();
    
    // Extract user preferences from message history (simplified)
    if (messageHistory.length > 0) {
      // This is a simple implementation that could be enhanced
      for (const message of messageHistory) {
        if (message.sender === 'user' && 
            (message.content.toLowerCase().includes('prefer') || 
             message.content.toLowerCase().includes('like'))) {
          const words = message.content.split(' ');
          const preferenceWord = words[words.length - 1].toLowerCase().replace(/[.,!?]/g, '');
          this.context.userPreferences[preferenceWord] = true;
        }
      }
    }
  }

  /**
   * Get the current conversation context
   */
  getContext(): ConversationContext {
    return { ...this.context };
  }
}
