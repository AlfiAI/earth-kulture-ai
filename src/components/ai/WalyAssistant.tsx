
import { useState, useRef } from 'react';
import { Bot } from 'lucide-react';
import { useWalyChat } from '@/hooks/use-waly-chat';
import { useChatPosition } from '@/hooks/use-chat-position';
import WalyChatButton from './WalyChatButton';
import WalyChatPanel from './WalyChatPanel';
import WalyChatOutsideClickHandler from './WalyChatOutsideClickHandler';

interface WalyAssistantProps {
  initialOpen?: boolean;
}

// Conversation starter questions for standard Waly
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

const WalyAssistant = ({ initialOpen = false }: WalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [showNewChat, setShowNewChat] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const position = useChatPosition();
  
  const {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    handleSend
  } = useWalyChat();
  
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
      {/* Chat Button */}
      {!isOpen && (
        <WalyChatButton 
          onClick={toggleOpen} 
          position={position} 
          onStarterClick={handleStarterClick}
        />
      )}
      
      {/* Outside Click Handler */}
      <WalyChatOutsideClickHandler 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        chatRef={chatRef}
      />
      
      {/* Chat Panel */}
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
