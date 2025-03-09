
import { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Message, { MessageProps } from './Message';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <ScrollArea className="flex-1 py-4 px-4 bg-gradient-to-b from-gray-50/50 to-white/80 dark:from-gray-900/50 dark:to-gray-800/80">
      <div className="space-y-6 max-w-6xl mx-auto">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            {...message} 
          />
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3 p-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20 bg-primary/10 shadow-sm animate-float">
              <AvatarImage src="/lovable-uploads/664bce6b-c58c-464b-b306-64594271cbdc.png" alt="Waly" className="p-1" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-sky-500 text-white">
                W
              </AvatarFallback>
            </Avatar>
            
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 rounded-2xl p-5 shadow-lg max-w-[90%]">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <span className="w-3 h-3 rounded-full bg-primary/60 animate-pulse"></span>
                  <span className="w-3 h-3 rounded-full bg-primary/60 animate-pulse delay-150"></span>
                  <span className="w-3 h-3 rounded-full bg-primary/60 animate-pulse delay-300"></span>
                </div>
                <span className="text-sm text-muted-foreground font-medium">Waly is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messageEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
