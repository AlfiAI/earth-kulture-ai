
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
  
  // Force visibility on mount and route changes
  useEffect(() => {
    console.log("EnhancedWalyAssistant: Mounted on route:", location.pathname);
    
    // Function to ensure chat button visibility
    const forceWalyVisibility = () => {
      const chatButton = document.getElementById('chat-button');
      if (chatButton) {
        chatButton.style.visibility = 'visible';
        chatButton.style.opacity = '1';
        chatButton.style.display = 'block';
        chatButton.style.zIndex = '999999';
      }
      
      const walyContainer = document.getElementById('waly-container');
      if (walyContainer) {
        walyContainer.style.visibility = 'visible';
        walyContainer.style.opacity = '1';
        walyContainer.style.display = 'block';
        walyContainer.style.zIndex = '999999';
      }
    };
    
    // Apply immediately
    forceWalyVisibility();
    
    // Apply with multiple delays to catch rendering issues
    [100, 300, 500, 1000, 2000].forEach(delay => {
      setTimeout(forceWalyVisibility, delay);
    });
    
    // Continue checking periodically
    const interval = setInterval(forceWalyVisibility, 3000);
    
    return () => clearInterval(interval);
  }, [location.pathname]);
  
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

  // Always render both components for reliability
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
