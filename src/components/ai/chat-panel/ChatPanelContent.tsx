
import { CardContent } from "@/components/ui/card";
import EnhancedChatBanner from '../EnhancedChatBanner';
import MessageList from '../MessageList';
import ChatInput from '../ChatInput';
import ConversationStarters from '../ConversationStarters';
import { MessageProps } from '../Message';
import { motion } from "framer-motion";
import { useRef } from 'react';

interface ChatPanelContentProps {
  messages: MessageProps[];
  isTyping: boolean;
  showNewChat: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSend: () => void;
  starters: {
    text: string;
    icon: React.ReactNode;
  }[];
  onStarterClick: (text: string) => void;
  onNewChat: () => void;
  placeholder?: string;
}

const ChatPanelContent = ({
  messages,
  isTyping,
  showNewChat,
  inputValue,
  setInputValue,
  handleSend,
  starters,
  onStarterClick,
  onNewChat,
  placeholder
}: ChatPanelContentProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
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
            onStarterClick={onStarterClick}
            onNewChat={onNewChat}
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
          placeholder={placeholder}
        />
      </motion.div>
    </CardContent>
  );
};

export default ChatPanelContent;
