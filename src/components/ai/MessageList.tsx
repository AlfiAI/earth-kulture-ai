
import { useRef, useEffect } from 'react';
import { Loader2, Bot } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Message, { MessageProps } from './Message';

interface MessageListProps {
  messages: MessageProps[];
  isTyping: boolean;
}

const MessageList = ({ messages, isTyping }: MessageListProps) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            {...message} 
          />
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
  );
};

export default MessageList;
