
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatPosition } from '@/hooks/use-chat-position';
import WalyChatButton from './WalyChatButton';
import EnhancedChatPanel from './EnhancedChatPanel';
import OutsideClickHandler from './chat-panel/OutsideClickHandler';
import NavigationListener from './chat-panel/NavigationListener';
import { useEnhancedChat } from '@/hooks/use-enhanced-chat';
import { useContextAwareStarters } from '@/hooks/use-context-aware-starters';

interface EnhancedWalyAssistantProps {
  initialOpen?: boolean;
}

/**
 * Advanced AI assistant with ESG & Carbon Intelligence capabilities
 */
const EnhancedWalyAssistant = ({ initialOpen = false }: EnhancedWalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [showNewChat, setShowNewChat] = useState(true);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const position = useChatPosition();
  const location = useLocation();
  const { getContextAwareStarters } = useContextAwareStarters();
  const { inputValue, setInputValue, handleSend, messages, isTyping } = useEnhancedChat();
  
  // Debug logging and force visibility on all route changes
  useEffect(() => {
    console.log("EnhancedWalyAssistant mounted with state:", {
      isOpen,
      showNewChat,
      position,
      route: location.pathname
    });
    
    // Force visibility immediately and repeatedly
    const forceVisibility = () => {
      document.querySelectorAll('#chat-button, #waly-container').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.display = 'block';
          el.style.zIndex = '999999';
        }
      });
      console.log("Forced Waly visibility from EnhancedWalyAssistant");
    };
    
    // Call repeatedly with increasing delays
    forceVisibility();
    const intervals = [50, 100, 200, 500, 1000, 2000, 3000, 5000].map(delay => 
      setTimeout(forceVisibility, delay)
    );
    
    return () => intervals.forEach(clearTimeout);
  }, [location.pathname, position, isOpen, showNewChat]);
  
  const toggleOpen = () => {
    console.log("Toggle chat open state from:", isOpen, "to:", !isOpen);
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

  // Always render both components conditionally to ensure the chat button is visible
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
