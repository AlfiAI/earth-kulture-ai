
import { forwardRef, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatPanelContainer from './chat-panel/ChatPanelContainer';
import ChatPanelContent from './chat-panel/ChatPanelContent';
import { useEnhancedChat } from '@/hooks/use-enhanced-chat';
import { usePageContextStarters, getContextPlaceholder } from './chat-panel/usePageContextStarters';
import { usePageContext } from './chat-panel/usePageContext';

interface EnhancedChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position: { bottom: number; right: number };
  currentPath?: string;
}

const EnhancedChatPanel = forwardRef<HTMLDivElement, EnhancedChatPanelProps>(
  ({ isOpen, onClose, position, currentPath = '/' }, ref) => {
    const { messages, inputValue, setInputValue, isTyping, handleSend } = useEnhancedChat();
    const [showNewChat, setShowNewChat] = useState(true);
    
    // Get context-aware starters based on current path
    const starters = usePageContextStarters(currentPath);
    
    // Load relevant page context data
    const pageContext = usePageContext(isOpen, currentPath);
    
    const handleStarterClick = (text: string) => {
      setInputValue(text);
      // Automatically send the message
      setTimeout(() => {
        handleSend();
        setShowNewChat(false);
      }, 100);
    };
    
    const handleNewChat = () => {
      // Reset the chat
      window.location.reload();
    };

    // Get placeholder text based on current path
    const placeholderText = getContextPlaceholder(currentPath);

    return (
      <ChatPanelContainer isOpen={isOpen} ref={ref}>
        <ChatHeader 
          onClose={onClose} 
          title="Waly Pro" 
          subtitle={`Advanced ESG Intelligence${currentPath ? ` • ${currentPath.slice(1).charAt(0).toUpperCase() + currentPath.slice(2)}` : ''}`} 
        />
        
        <ChatPanelContent
          messages={messages}
          isTyping={isTyping}
          showNewChat={showNewChat}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSend={handleSend}
          starters={starters}
          onStarterClick={handleStarterClick}
          onNewChat={handleNewChat}
          placeholder={placeholderText}
        />
      </ChatPanelContainer>
    );
  }
);

EnhancedChatPanel.displayName = 'EnhancedChatPanel';

export default EnhancedChatPanel;
