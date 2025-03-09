
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
    
    // Check for visibility issues immediately after component mounts
    const checkVisibility = () => {
      const chatButton = document.getElementById('chat-button');
      if (!chatButton || 
          chatButton.style.visibility === 'hidden' || 
          chatButton.style.display === 'none' ||
          chatButton.style.opacity === '0') {
        
        console.log("Chat button not visible, forcing visibility");
        
        if (chatButton) {
          chatButton.style.visibility = 'visible';
          chatButton.style.opacity = '1';
          chatButton.style.display = 'block';
          console.log("Fixed chat button visibility");
        }
      } else {
        console.log("Chat button is already visible");
      }
    };
    
    // Call immediately and set several delayed checks
    checkVisibility();
    const intervals = [100, 300, 500, 1000, 2000].map(delay => 
      setTimeout(checkVisibility, delay)
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
