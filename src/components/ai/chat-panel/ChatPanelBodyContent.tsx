
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageList from '../MessageList';
import ConversationStarters from '../ConversationStarters';
import { motion } from "framer-motion";

interface ChatPanelBodyContentProps {
  messages: any[];
  isTyping: boolean;
  showNewChat: boolean;
  starters: Array<{ text: string; icon: React.ReactNode }>;
  onStarterClick: (text: string) => void;
  onNewChat: () => void;
}

const ChatPanelBodyContent = ({ 
  messages, 
  isTyping, 
  showNewChat, 
  starters, 
  onStarterClick, 
  onNewChat 
}: ChatPanelBodyContentProps) => {
  return (
    <>
      {messages.length === 0 && showNewChat && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex-1"
        >
          <ConversationStarters 
            starters={starters} 
            onStarterClick={onStarterClick}
            onNewChat={onNewChat}
          />
        </motion.div>
      )}
      
      {(messages.length > 0 || !showNewChat) && (
        <ScrollArea className="flex-1 py-4 px-4 md:px-6 bg-gradient-to-b from-gray-50/50 to-white/80 dark:from-gray-900/50 dark:to-gray-800/80">
          <MessageList 
            messages={messages} 
            isTyping={isTyping} 
          />
        </ScrollArea>
      )}
    </>
  );
};

export default ChatPanelBodyContent;
