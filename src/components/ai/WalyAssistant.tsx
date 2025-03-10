
import { useState, useRef } from 'react';
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
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const position = useChatPosition();
  
  const { messages, inputValue, setInputValue, isTyping, handleSend } = useWalyChat();
  
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
  useState(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  });

  return (
    <>
      {!isOpen && (
        <WalyChatButton 
          onClick={toggleOpen} 
          position={position} 
          onStarterClick={handleStarterClick}
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
    </>
  );
};

export default WalyAssistant;
