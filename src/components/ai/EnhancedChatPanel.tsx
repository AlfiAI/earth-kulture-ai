
import { useRef, forwardRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import EnhancedChatBanner from './EnhancedChatBanner';
import { useEnhancedChat } from '@/hooks/use-enhanced-chat';
import ConversationStarters from './ConversationStarters';
import { TrendingUp, Zap, Lightbulb, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position: { bottom: number; right: number };
}

// Enhanced conversation starter questions with modern styling
const starters = [
  {
    text: "Analyze my sustainability progress trends",
    icon: <TrendingUp className="h-4 w-4 text-sky-500" />
  },
  {
    text: "Generate ESG performance forecast",
    icon: <BarChart className="h-4 w-4 text-emerald-500" />
  },
  {
    text: "Identify compliance risk areas",
    icon: <Zap className="h-4 w-4 text-amber-500" />
  },
  {
    text: "Suggest optimization strategies",
    icon: <Lightbulb className="h-4 w-4 text-purple-500" />
  }
];

const EnhancedChatPanel = forwardRef<HTMLDivElement, EnhancedChatPanelProps>(
  ({ isOpen, onClose, position }, ref) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { messages, inputValue, setInputValue, isTyping, handleSend } = useEnhancedChat();
    const [showNewChat, setShowNewChat] = useState(true);
    
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

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.4
            }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full max-w-[1000px] mx-auto flex flex-col"
            >
              <Card
                ref={ref}
                className={cn(
                  "h-full w-full overflow-hidden transition-all duration-300 ease-in-out",
                  "bg-card/95 backdrop-blur-sm border-primary/10 shadow-xl"
                )}
              >
                <ChatHeader onClose={onClose} title="Waly Pro" subtitle="Advanced ESG Intelligence" />
                
                <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
                  <EnhancedChatBanner />
                  
                  {messages.length === 0 && showNewChat && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <ConversationStarters 
                        starters={starters} 
                        onStarterClick={handleStarterClick}
                        onNewChat={handleNewChat}
                      />
                    </motion.div>
                  )}
                  
                  {(messages.length > 0 || !showNewChat) && (
                    <MessageList 
                      messages={messages} 
                      isTyping={isTyping} 
                    />
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <ChatInput
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      handleSend={handleSend}
                      inputRef={inputRef}
                      placeholder="Ask about benchmarking, predictions, goals..."
                    />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

EnhancedChatPanel.displayName = 'EnhancedChatPanel';

export default EnhancedChatPanel;
