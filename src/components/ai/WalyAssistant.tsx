
import { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, MessageSquarePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useWalyChat } from '@/hooks/use-waly-chat';
import ConversationStarters from './ConversationStarters';

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
  const [position, setPosition] = useState({ bottom: 4, right: 4 });
  const [showNewChat, setShowNewChat] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  
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
    // Automatically send the message
    setTimeout(() => {
      handleSend();
      setShowNewChat(false);
    }, 100);
  };
  
  const handleNewChat = () => {
    // Reset the chat
    window.location.reload();
  };

  // Handle scrolling by adjusting the assistant's position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollBottom = scrollY + viewportHeight;
      const threshold = documentHeight - 200;
      
      // Adjust position based on scroll
      if (scrollBottom >= threshold) {
        // Near bottom of page, move up a bit
        setPosition({ bottom: 20, right: 4 });
      } else {
        // Regular position
        setPosition({ bottom: 4, right: 4 });
      }
    };

    // Handle window resize
    const handleResize = () => {
      // Adjust position if needed based on window size
      if (window.innerWidth < 640) { // Mobile view
        setPosition({ bottom: 2, right: 1 });
      } else {
        setPosition({ bottom: 4, right: 4 });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial position check
    handleResize();
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle clicks outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatRef.current && 
        !chatRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('button')
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          className="fixed rounded-full w-16 h-16 shadow-xl bg-gradient-to-r from-primary to-sky-500 text-white hover:bg-primary/90 flex items-center justify-center z-50 transition-all duration-300 animate-pulse-gentle"
          style={{ bottom: `${position.bottom}rem`, right: `${position.right}rem` }}
        >
          <div className="relative">
            <MessageSquarePlus className="h-7 w-7" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-float" />
          </div>
        </Button>
      )}
      
      <Card
        ref={chatRef}
        className={cn(
          "fixed shadow-xl border-primary/10 overflow-hidden transition-all duration-300 ease-in-out z-50 bg-card/95 backdrop-blur-sm",
          isOpen ? "w-80 sm:w-96 h-[600px] max-h-[80vh] opacity-100 rounded-2xl" : "w-0 h-0 opacity-0 pointer-events-none"
        )}
        style={{ 
          bottom: `${position.bottom}rem`, 
          right: `${position.right}rem`,
          maxHeight: isOpen ? 'calc(100vh - 100px)' : '0'
        }}
      >
        <ChatHeader 
          onClose={toggleOpen} 
          title="Waly AI" 
          subtitle="ESG & Carbon Intelligence" 
        />
        
        <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
          {messages.length === 0 && showNewChat && (
            <ConversationStarters 
              starters={starters} 
              onStarterClick={handleStarterClick}
              onNewChat={handleNewChat}
            />
          )}
          
          {(messages.length > 0 || !showNewChat) && (
            <MessageList 
              messages={messages} 
              isTyping={isTyping} 
            />
          )}
          
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSend={handleSend}
            inputRef={inputRef}
            placeholder="Ask about ESG performance, carbon tracking, or sustainability..."
          />
        </CardContent>
      </Card>
    </>
  );
};

export default WalyAssistant;
