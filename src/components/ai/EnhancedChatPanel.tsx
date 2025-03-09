
import { forwardRef, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatPanelContainer from './chat-panel/ChatPanelContainer';
import ChatPanelContent from './chat-panel/ChatPanelContent';
import { useEnhancedChat } from '@/hooks/use-enhanced-chat';
import { usePageContextStarters, getContextPlaceholder } from './chat-panel/usePageContextStarters';
import { usePageContext } from './chat-panel/usePageContext';
import { MessageProps } from './Message';

interface EnhancedChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position: { bottom: number; right: number };
  currentPath?: string;
  messages: MessageProps[];
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSend: () => void;
  showNewChat: boolean;
  onStarterClick: (text: string) => void;
  onNewChat: () => void;
}

const EnhancedChatPanel = forwardRef<HTMLDivElement, EnhancedChatPanelProps>(
  ({ isOpen, onClose, position, currentPath = '/', messages, inputValue, setInputValue, handleSend, showNewChat, onStarterClick, onNewChat }, ref) => {
    const { isTyping } = useEnhancedChat();
    
    // Get context-aware starters based on current path
    const starters = usePageContextStarters(currentPath);
    
    // Load relevant page context data
    const pageContext = usePageContext(isOpen, currentPath);
    
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
          onStarterClick={onStarterClick}
          onNewChat={onNewChat}
          placeholder={placeholderText}
        />
      </ChatPanelContainer>
    );
  }
);

EnhancedChatPanel.displayName = 'EnhancedChatPanel';

export default EnhancedChatPanel;
