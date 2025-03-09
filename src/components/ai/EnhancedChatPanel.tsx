
import { useRef, forwardRef } from 'react';
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
  position: { bottom: number; right: number };
}

const EnhancedChatPanel = forwardRef<HTMLDivElement, EnhancedChatPanelProps>(
  ({ isOpen, onClose, position }, ref) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { messages, inputValue, setInputValue, isTyping, handleSend } = useEnhancedChat();

    return (
      <Card
        ref={ref}
        className={cn(
          "fixed shadow-lg border overflow-hidden transition-all duration-300 ease-in-out z-50",
          isOpen ? "w-80 sm:w-96 h-[550px] opacity-100" : "w-0 h-0 opacity-0 pointer-events-none"
        )}
        style={{ 
          bottom: `${position.bottom}rem`, 
          right: `${position.right}rem`,
          maxHeight: isOpen ? 'calc(100vh - 100px)' : '0'
        }}
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
  }
);

EnhancedChatPanel.displayName = 'EnhancedChatPanel';

export default EnhancedChatPanel;
