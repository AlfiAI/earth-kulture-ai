
import { useState, useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { MessageProps } from './Message';

interface WalyAssistantProps {
  initialOpen?: boolean;
}

const WalyAssistant = ({ initialOpen = false }: WalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      id: '1',
      content: "Hello! I'm Waly, your ESG & Carbon Intelligence Assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };
  
  const handleSend = () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: MessageProps = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    setTimeout(() => {
      const aiResponses = [
        "Based on your current carbon emissions data, I recommend focusing on reducing Scope 2 emissions by implementing renewable energy sources at your facilities.",
        "Your ESG compliance score has improved by 12% since last quarter. Great progress!",
        "I've analyzed your supply chain and identified 3 high-risk suppliers that may not meet your sustainability criteria. Would you like more details?",
        "According to the latest regulations, you'll need to update your carbon reporting methodology by Q1 next year. I can help you prepare for this change.",
        "Your organization is on track to meet 85% of your sustainability goals this year. The main area needing attention is water usage efficiency."
      ];
      
      const aiMessage: MessageProps = {
        id: Date.now().toString(),
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          className="fixed right-4 bottom-4 rounded-full w-14 h-14 shadow-lg p-0 animate-in bg-primary text-white hover:bg-primary/90"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}
      
      <Card
        className={cn(
          "fixed right-4 bottom-4 w-80 sm:w-96 shadow-lg border overflow-hidden transition-all duration-300 ease-in-out z-50",
          isOpen ? "h-[550px] max-h-[80vh] opacity-100" : "h-0 opacity-0 pointer-events-none"
        )}
      >
        <ChatHeader onClose={toggleOpen} />
        
        <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
          <MessageList 
            messages={messages} 
            isTyping={isTyping} 
          />
          
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSend={handleSend}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default WalyAssistant;
