
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatPosition } from '@/hooks/use-chat-position';
import { useEnhancedChat } from '@/hooks/use-enhanced-chat';
import WalyChatButton from './WalyChatButton';
import EnhancedChatPanel from './EnhancedChatPanel';
import { useWalyInjector } from '@/hooks/use-waly-injector';

interface EnhancedWalyAssistantProps {
  initialOpen?: boolean;
}

/**
 * Enhanced Waly Assistant with improved visibility
 */
const EnhancedWalyAssistant = ({ initialOpen = false }: EnhancedWalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [showNewChat, setShowNewChat] = useState(true);
  const [showStarters, setShowStarters] = useState(false);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const position = useChatPosition();
  const location = useLocation();
  
  // Use the enhanced Waly injector to ensure visibility
  useWalyInjector();
  
  const { messages, inputValue, setInputValue, handleSend, isTyping } = useEnhancedChat();
  
  // Log visibility status for debugging
  useEffect(() => {
    console.log("EnhancedWalyAssistant mounted on route:", location.pathname);
    console.log("Chat is open:", isOpen);
    
    // Force re-render on route change
    setIsOpen(isOpen);
  }, [location.pathname]);
  
  const toggleOpen = () => {
    console.log("Toggling chat open state from", isOpen, "to", !isOpen);
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
  
  const handleMouseEnter = () => {
    setShowStarters(true);
  };
  
  const handleMouseLeave = () => {
    setShowStarters(false);
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
    <div id="waly-assistant-container" className="fixed" style={{ zIndex: 9999999 }}>
      {!isOpen && (
        <WalyChatButton 
          onClick={toggleOpen} 
          position={position}
          onStarterClick={handleStarterClick}
          contextAwareStarters={getContextAwareStarters()}
          showStarters={showStarters}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
    </div>
  );
};

export default EnhancedWalyAssistant;
