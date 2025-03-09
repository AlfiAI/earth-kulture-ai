
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useEnhancedChat } from '@/hooks/use-enhanced-chat';
import { useChatPosition } from '@/hooks/use-chat-position';
import WalyChatButton from './WalyChatButton';
import EnhancedChatPanel from './EnhancedChatPanel';
import OutsideClickHandler from './chat-panel/OutsideClickHandler';
import NavigationListener from './chat-panel/NavigationListener';
import { useContextAwareStarters } from '@/hooks/use-context-aware-starters';

interface EnhancedWalyAssistantProps {
  initialOpen?: boolean;
}

const EnhancedWalyAssistant = ({ initialOpen = false }: EnhancedWalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [showNewChat, setShowNewChat] = useState(true);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const position = useChatPosition();
  const { inputValue, setInputValue, handleSend, messages } = useEnhancedChat();
  const location = useLocation();
  const { getContextAwareStarters } = useContextAwareStarters();
  
  // Force visibility check on route change
  useEffect(() => {
    // Ensure Waly is visible on all routes
    console.log("Route changed, Waly should be visible:", location.pathname);
  }, [location.pathname]);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const handleStarterClick = (text: string) => {
    setInputValue(text);
    // Open the chat when starter is clicked
    setIsOpen(true);
    // Automatically send the message after a small delay
    setTimeout(() => {
      handleSend();
      setShowNewChat(false);
    }, 100);
  };

  const handleNewChat = () => {
    // Reset the chat
    window.location.reload();
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
      
      <OutsideClickHandler
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        chatPanelRef={chatPanelRef}
      />
      
      <NavigationListener messages={messages} />
      
      <EnhancedChatPanel 
        ref={chatPanelRef}
        isOpen={isOpen}
        onClose={toggleOpen}
        position={position}
        currentPath={location.pathname}
      />
    </>
  );
};

export default EnhancedWalyAssistant;
