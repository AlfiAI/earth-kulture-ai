import { useState, useRef, useEffect } from 'react';
import { ArrowUpCircle, PanelRightClose, PanelRightOpen, Bot, User, Loader2, BotMessageSquare, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface WalyAssistantProps {
  initialOpen?: boolean;
}

const WalyAssistant = ({ initialOpen = false }: WalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Waly, your ESG & Carbon Intelligence Assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
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
    
    const userMessage: Message = {
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
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h2 className="font-medium">Waly Assistant</h2>
            <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/20">Beta</Badge>
          </div>
          
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={toggleOpen}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg p-3 text-sm",
                      message.sender === 'user'
                        ? "bg-primary text-primary-foreground ml-4"
                        : "bg-muted mr-4 relative"
                    )}
                  >
                    {message.sender === 'ai' && (
                      <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">
                        <Bot className="h-3 w-3" />
                      </div>
                    )}
                    
                    {message.content}
                    
                    <div
                      className={cn(
                        "text-xs mt-1",
                        message.sender === 'user'
                          ? "text-primary-foreground/70 text-right"
                          : "text-muted-foreground"
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted max-w-[85%] rounded-lg p-3 flex items-center space-x-2 mr-4 relative">
                    <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">
                      <Bot className="h-3 w-3" />
                    </div>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Waly is thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t">
            <div className="relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Waly anything about ESG or carbon management..."
                className="resize-none pr-10 min-h-[60px] max-h-32"
                maxLength={500}
              />
              <Button
                onClick={handleSend}
                disabled={inputValue.trim() === ''}
                size="icon"
                className="absolute right-2 bottom-2 h-6 w-6 rounded-full"
              >
                <ArrowUpCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Powered by EarthKulture AI
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default WalyAssistant;
