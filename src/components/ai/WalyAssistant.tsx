
import { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useWalyChat } from '@/hooks/use-waly-chat';

interface WalyAssistantProps {
  initialOpen?: boolean;
}

const WalyAssistant = ({ initialOpen = false }: WalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [position, setPosition] = useState({ bottom: 4, right: 4 });
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

  // Handle scrolling by adjusting the assistant's position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Adjust position based on scroll
      if (scrollY + viewportHeight >= documentHeight - 100) {
        // Near bottom of page, move up a bit
        setPosition({ bottom: 16, right: 4 });
      } else {
        // Reset to default position
        setPosition({ bottom: 4, right: 4 });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          className="fixed rounded-full w-14 h-14 shadow-lg p-0 animate-in bg-primary text-white hover:bg-primary/90 flex items-center justify-center z-50 transition-all duration-300"
          style={{ bottom: `${position.bottom}rem`, right: `${position.right}rem` }}
        >
          <div className="relative">
            <Bot className="h-6 w-6" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-3 w-3 text-yellow-300" />
            </div>
          </div>
        </Button>
      )}
      
      <Card
        ref={chatRef}
        className={cn(
          "fixed shadow-lg border overflow-hidden transition-all duration-300 ease-in-out z-50",
          isOpen ? "w-80 sm:w-96 h-[550px] max-h-[80vh] opacity-100" : "w-0 h-0 opacity-0 pointer-events-none"
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
          <MessageList 
            messages={messages} 
            isTyping={isTyping} 
          />
          
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
