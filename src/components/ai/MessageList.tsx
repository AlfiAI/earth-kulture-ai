
import { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Message, { MessageProps } from './Message';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

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
    <ScrollArea className="flex-1 py-4 px-4 md:px-6 bg-gradient-to-b from-gray-50/50 to-white/80 dark:from-gray-900/50 dark:to-gray-800/80">
      <div className="space-y-6 mx-auto">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            {...message} 
          />
        ))}
        
        {isTyping && (
          <motion.div 
            className="flex items-start gap-3 p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar className="h-12 w-12 border-2 border-primary/20 bg-primary/10 shadow-sm">
              <AvatarImage src="/lovable-uploads/db6e9d05-9d19-408f-ac05-996d4d8006fb.png" alt="Waly" className="p-1" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-sky-500 text-white">
                W
              </AvatarFallback>
            </Avatar>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-lg w-[calc(100%-5rem)]">
              <motion.div 
                className="flex items-center space-x-3"
                animate={{ 
                  scale: [1, 1.03, 1],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              >
                <div className="flex space-x-2">
                  <motion.span 
                    className="w-3 h-3 rounded-full bg-emerald-500/60"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  />
                  <motion.span 
                    className="w-3 h-3 rounded-full bg-sky-500/60"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, delay: 0.3, repeat: Infinity, repeatType: "reverse" }}
                  />
                  <motion.span 
                    className="w-3 h-3 rounded-full bg-primary/60"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, delay: 0.6, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
                <span className="text-sm text-muted-foreground font-medium">Processing your request...</span>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        <div ref={messageEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
