
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatPosition } from '@/hooks/use-chat-position';
import { useEnhancedChat } from '@/hooks/use-enhanced-chat';
import WalyChatButton from './WalyChatButton';
import EnhancedChatPanel from './EnhancedChatPanel';

interface EnhancedWalyAssistantProps {
  initialOpen?: boolean;
}

/**
 * Simplified Enhanced Waly Assistant
 */
const EnhancedWalyAssistant = ({ initialOpen = false }: EnhancedWalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [showNewChat, setShowNewChat] = useState(true);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const position = useChatPosition();
  const location = useLocation();
  
  const { messages, inputValue, setInputValue, handleSend, isTyping } = useEnhancedChat();
  
  // Basic visibility logging
  useEffect(() => {
    console.log("EnhancedWalyAssistant mounted on route:", location.pathname);
  }, [location.pathname]);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const handleStarterClick = (text: string) => {
    setInputValue(text);
    setIsOpen(true);
    setTimeout(() => {
      handleSend();
      setShowNewChat(false);
    }, 100);
  };

  const handleNewChat = () => {
    window.location.reload();
  };
  
  // Context-aware starters based on current route
  const getContextAwareStarters = () => {
    // Default starters
    return [
      "How can I improve my ESG score?",
      "Explain carbon footprint tracking",
      "What ESG metrics should I monitor?",
      "How to start sustainability reporting?"
    ];
  };

  return (
    <>
      {!isOpen && (
        <WalyChatButton 
          onClick={toggleOpen} 
          position={position}
          onStarterClick={handleStarterClick}
          contextAwareStarters={getContextAwareStarters()}
        />
      )}
      
      {isOpen && (
        <EnhancedChatPanel 
          ref={chatPanelRef}
          isOpen={isOpen}
          onClose={toggleOpen}
          position={position}
          currentPath={location.pathname}
          messages={messages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSend={handleSend}
          showNewChat={showNewChat}
          onStarterClick={handleStarterClick}
          onNewChat={handleNewChat}
        />
      )}
    </>
  );
};

export default EnhancedWalyAssistant;
