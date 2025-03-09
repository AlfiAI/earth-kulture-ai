
import { RefObject } from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ConversationStarters from './ConversationStarters';
import { MessageProps } from './Message';
import { motion, AnimatePresence } from "framer-motion";

interface WalyChatPanelProps {
  isOpen: boolean;
  position: { bottom: number; right: number };
  chatRef: RefObject<HTMLDivElement>;
  onClose: () => void;
  messages: MessageProps[];
  inputValue: string;
  setInputValue: (value: string) => void;
  isTyping: boolean;
  handleSend: () => void;
  inputRef: RefObject<HTMLTextAreaElement>;
  showNewChat: boolean;
  onStarterClick: (text: string) => void;
  onNewChat: () => void;
  starters: Array<{ text: string; icon: React.ReactNode }>;
}

const WalyChatPanel = ({
  isOpen,
  position,
  chatRef,
  onClose,
  messages,
  inputValue,
  setInputValue,
  isTyping,
  handleSend,
  inputRef,
  showNewChat,
  onStarterClick,
  onNewChat,
  starters
}: WalyChatPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-x-0 z-50 flex justify-center px-0"
          style={{ 
            bottom: 0,
            height: "calc(100vh - 60px)"
          }}
        >
          <Card
            ref={chatRef}
            className={cn(
              "w-full h-full max-h-[800px] shadow-2xl overflow-hidden",
              "bg-white/95 backdrop-blur-md dark:bg-gray-900/90",
              "border-none ring-1 ring-black/5 dark:ring-white/10 rounded-none"
            )}
          >
            <ChatHeader 
              onClose={onClose} 
              title="Waly AI" 
              subtitle="ESG & Carbon Intelligence" 
            />
            
            <div className="flex flex-col h-[calc(100%-72px)]">
              {messages.length === 0 && showNewChat && (
                <ConversationStarters 
                  starters={starters} 
                  onStarterClick={onStarterClick}
                  onNewChat={onNewChat}
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
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalyChatPanel;
