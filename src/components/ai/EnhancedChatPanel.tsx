
import { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import EnhancedChatBanner from './EnhancedChatBanner';
import { useEnhancedChat } from '@/hooks/use-enhanced-chat';

interface EnhancedChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedChatPanel = ({ isOpen, onClose }: EnhancedChatPanelProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, inputValue, setInputValue, isTyping, handleSend } = useEnhancedChat();

  return (
    <Card
      className={cn(
        "fixed right-4 bottom-4 w-80 sm:w-96 shadow-lg border overflow-hidden transition-all duration-300 ease-in-out z-50",
        isOpen ? "h-[550px] max-h-[80vh] opacity-100" : "h-0 opacity-0 pointer-events-none"
      )}
    >
      <ChatHeader onClose={onClose} title="Waly Pro" subtitle="Advanced ESG Intelligence" />
      
      <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
        <EnhancedChatBanner />
        
        <MessageList 
          messages={messages} 
          isTyping={isTyping} 
        />
        
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSend={handleSend}
          inputRef={inputRef}
          placeholder="Ask about benchmarking, predictions, goals..."
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedChatPanel;
