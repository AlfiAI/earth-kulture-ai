
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
  
  // Force visibility whenever component mounts or route changes
  useEffect(() => {
    console.log("EnhancedWalyAssistant: Mounted on route:", location.pathname);
    
    // Function to ensure chat button visibility with !important styles
    const forceWalyVisibility = () => {
      const chatButton = document.getElementById('chat-button');
      if (chatButton) {
        chatButton.setAttribute('style', `
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
          z-index: 9999999 !important;
          position: fixed !important;
          bottom: ${position.bottom}rem !important;
          right: ${position.right}rem !important;
          pointer-events: auto !important;
          transform: none !important;
        `);
      }
      
      const walyContainer = document.getElementById('waly-container');
      if (walyContainer) {
        walyContainer.setAttribute('style', `
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
          z-index: 9999999 !important;
          position: fixed !important;
          pointer-events: auto !important;
          transform: none !important;
        `);
      }
    };
    
    // Apply immediately
    forceWalyVisibility();
    
    // Apply with multiple delays to catch rendering issues
    [50, 100, 200, 300, 500, 1000, 2000, 5000].forEach(delay => {
      setTimeout(forceWalyVisibility, delay);
    });
    
    // Continue checking periodically
    const interval = setInterval(forceWalyVisibility, 500);
    
    // Use MutationObserver to detect DOM changes
    const observer = new MutationObserver(() => {
      forceWalyVisibility();
    });
    
    // Start observing the document body for all changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true
    });
    
    // Listen for custom event to open Waly from other components
    const handleOpenWalyEvent = () => {
      console.log("Received open-waly-chat event");
      setIsOpen(true);
    };
    
    document.addEventListener('open-waly-chat', handleOpenWalyEvent);
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
      document.removeEventListener('open-waly-chat', handleOpenWalyEvent);
    };
  }, [location.pathname, position]);
  
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

  // Log to check if component is rendering
  useEffect(() => {
    console.log("EnhancedWalyAssistant rendering, isOpen:", isOpen);
  }, [isOpen]);

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
