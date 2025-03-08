
import { MessageProps } from '@/components/ai/Message';
import { 
  createUserMessage, 
  createAIMessage,
  getWelcomeMessage,
  getEnhancedWelcomeMessage
} from '../../utils/conversationUtils';

/**
 * Factory functions for creating and retrieving different types of messages
 */
export const messageFactory = {
  createUserMessage,
  createAIMessage,
  getWelcomeMessage,
  getEnhancedWelcomeMessage
};
