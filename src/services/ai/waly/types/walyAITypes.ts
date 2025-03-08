
import { MessageProps } from '@/components/ai/Message';

export interface ConversationContext {
  recentQueries: string[];
  userPreferences: Record<string, any>;
  lastUpdated: Date;
}

export interface WalyAIServiceInterface {
  processQuery(query: string, messageHistory?: MessageProps[]): Promise<string>;
  createUserMessage(content: string): MessageProps;
  createAIMessage(content: string): MessageProps;
  getWelcomeMessage(): MessageProps;
  getEnhancedWelcomeMessage(): MessageProps;
}
