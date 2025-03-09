
import { useState } from 'react';
import { useEnhancedChat } from '@/hooks/use-enhanced-chat';
import { MessageProps } from '../Message';

interface AIChatManagerProps {
  onNewChat: () => void;
  initialOpen?: boolean;
}

/**
 * Manages the AI chat state and operations
 */
const AIChatManager = ({ onNewChat, initialOpen = false }: AIChatManagerProps) => {
  const [showNewChat, setShowNewChat] = useState(true);
  const { inputValue, setInputValue, handleSend, messages } = useEnhancedChat();
  
  const handleStarterClick = (text: string) => {
    setInputValue(text);
    // Automatically send the message after a small delay
    setTimeout(() => {
      handleSend();
      setShowNewChat(false);
    }, 100);
  };

  return {
    showNewChat,
    setShowNewChat,
    inputValue,
    setInputValue,
    handleSend,
    messages,
    handleStarterClick
  };
};

export default AIChatManager;
