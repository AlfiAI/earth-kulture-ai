
import { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Message, { MessageProps } from './Message';
import { motion, AnimatePresence } from "framer-motion";
import MessageAvatar from './message-parts/MessageAvatar';
import { Sparkles } from "lucide-react";

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
    <ScrollArea className="flex-1 py-4 px-4 md:px-6 bg-gradient-to-b from-gray-50/50 via-white/80 to-gray-50/50 dark:from-gray-900/50 dark:via-gray-800/80 dark:to-gray-900/50">
      <div className="space-y-6 mx-auto">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: index * 0.1
              }}
            >
              <Message {...message} />
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              className="flex items-start gap-3 p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MessageAvatar sender="ai" />
              
              <motion.div 
                className="relative bg-white dark:bg-gray-800 border border-emerald-100 dark:border-gray-700 rounded-2xl p-5 shadow-lg w-[calc(100%-5rem)]"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <motion.div 
                  className="flex items-center space-x-3"
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    repeatType: "reverse" as const 
                  }}
                >
                  <div className="flex space-x-2">
                    {[0, 1, 2].map((i) => (
                      <motion.span 
                        key={i}
                        className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 0.8, 
                          delay: i * 0.2,
                          repeat: Infinity,
                          repeatType: "reverse" as const
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                    Processing your request
                    <motion.div
                      animate={{ 
                        rotate: [0, 180, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                    </motion.div>
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
          
          <div ref={messageEndRef} />
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
};

export default MessageList;
