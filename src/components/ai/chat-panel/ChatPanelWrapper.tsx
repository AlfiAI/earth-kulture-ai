
import { RefObject } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChatPanelHeader from './ChatPanelHeader';
import ChatPanelContent from './ChatPanelContent';

interface ChatPanelWrapperProps {
  isOpen: boolean;
  position: { bottom: number; right: number };
  chatRef: RefObject<HTMLDivElement>;
  onClose: () => void;
  messages: any[];
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

const ChatPanelWrapper = ({
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
}: ChatPanelWrapperProps) => {
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
            height: "calc(100vh - 60px)",
            width: "100%"
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
            <ChatPanelHeader 
              onClose={onClose} 
              title="Waly AI" 
              subtitle="ESG & Carbon Intelligence" 
            />
            
            <ChatPanelContent
              messages={messages}
              isTyping={isTyping}
              showNewChat={showNewChat}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSend={handleSend}
              starters={starters}
              onStarterClick={onStarterClick}
              onNewChat={onNewChat}
              placeholder="Ask about ESG performance, carbon tracking, or sustainability..."
            />
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPanelWrapper;
