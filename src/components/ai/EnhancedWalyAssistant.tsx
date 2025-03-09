
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
  
  // Force visibility on mount
  useEffect(() => {
    console.log("EnhancedWalyAssistant: Forcing visibility at route:", location.pathname);
    
    // Force chat button visibility directly
    const chatButton = document.getElementById('chat-button');
    if (chatButton) {
      chatButton.style.visibility = 'visible';
      chatButton.style.opacity = '1';
      chatButton.style.display = 'block';
      chatButton.style.zIndex = '999999';
    }
    
    // Always render Waly button when not open
    if (!isOpen) {
      setTimeout(() => {
        const chatButtonElement = document.getElementById('chat-button');
        if (!chatButtonElement || 
            chatButtonElement.style.display === 'none' ||
            chatButtonElement.style.visibility === 'hidden') {
          console.log("Chat button not visible, forcing re-render");
          setIsOpen(false); // Force re-render
        }
      }, 500);
    }
  }, [location.pathname, isOpen]);
  
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

  // Always render both components to ensure the chat button is visible
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
