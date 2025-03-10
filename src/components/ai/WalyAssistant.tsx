
import { useState, useRef, useEffect } from 'react';
import { useChatPosition } from '@/hooks/use-chat-position';
import { useWalyChat } from '@/hooks/use-waly-chat';
import WalyChatButton from './WalyChatButton';
import WalyChatPanel from './WalyChatPanel';
import { Bot } from 'lucide-react';

interface WalyAssistantProps {
  initialOpen?: boolean;
}

const WalyAssistant = ({ initialOpen = false }: WalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [showNewChat, setShowNewChat] = useState(true);
  const [showStarters, setShowStarters] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const position = useChatPosition();
  
  const { messages, inputValue, setInputValue, isTyping, handleSend } = useWalyChat();
  
  // Force visibility of the chat component
  useEffect(() => {
    console.log('WalyAssistant mounted, ensuring visibility');
    const forceWalyVisibility = () => {
      const container = document.getElementById('waly-assistant-container');
      if (container) {
        container.style.cssText = `
          position: fixed !important;
          bottom: ${position.bottom}rem !important;
          right: ${position.right}rem !important;
          z-index: 99999999 !important;
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        `;
      }
    };
    
    forceWalyVisibility();
    // Run periodically to ensure visibility
    const interval = setInterval(forceWalyVisibility, 300);
    
    return () => clearInterval(interval);
  }, [position]);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
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
  
  // Starters definition
  const starters = [
    {
      text: "How can I improve my ESG score?",
      icon: <Bot className="h-4 w-4 text-primary" />
    },
    {
      text: "Explain carbon footprint tracking",
      icon: <Bot className="h-4 w-4 text-green-500" />
    },
    {
      text: "What ESG metrics should I monitor?",
      icon: <Bot className="h-4 w-4 text-blue-500" />
    },
    {
      text: "How to start sustainability reporting?",
      icon: <Bot className="h-4 w-4 text-purple-500" />
    }
  ];

  // Handle outside clicks to close the panel
  const handleOutsideClick = (e: MouseEvent) => {
    if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  // Effect to add/remove click listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div id="waly-assistant-container" className="fixed" style={{ 
      position: 'fixed',
      bottom: `${position.bottom}rem`, 
      right: `${position.right}rem`,
      zIndex: 99999999,
      visibility: 'visible',
      display: 'block',
      opacity: 1,
      pointerEvents: 'auto'
    }}>
      {!isOpen && (
        <WalyChatButton 
          onClick={toggleOpen} 
          position={position} 
          onStarterClick={handleStarterClick}
          showStarters={showStarters}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
      
      <WalyChatPanel
        isOpen={isOpen}
        position={position}
        chatRef={chatRef}
        onClose={toggleOpen}
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isTyping={isTyping}
        handleSend={handleSend}
        inputRef={inputRef}
        showNewChat={showNewChat}
        onStarterClick={handleStarterClick}
        onNewChat={handleNewChat}
        starters={starters}
      />
    </div>
  );
};

export default WalyAssistant;
