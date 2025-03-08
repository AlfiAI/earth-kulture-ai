
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
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

  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          className="fixed right-4 bottom-4 rounded-full w-14 h-14 shadow-lg p-0 animate-in bg-primary text-white hover:bg-primary/90 flex items-center justify-center"
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
        className={cn(
          "fixed right-4 bottom-4 w-80 sm:w-96 shadow-lg border overflow-hidden transition-all duration-300 ease-in-out z-50",
          isOpen ? "h-[550px] max-h-[80vh] opacity-100" : "h-0 opacity-0 pointer-events-none"
        )}
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
