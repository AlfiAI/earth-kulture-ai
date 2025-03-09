
import { RefObject } from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ConversationStarters from './ConversationStarters';
import { MessageProps } from './Message';

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
    <Card
      ref={chatRef}
      className={cn(
        "fixed shadow-2xl overflow-hidden transition-all duration-300 ease-in-out z-50",
        "bg-white/95 backdrop-blur-md dark:bg-gray-900/90",
        "border-none ring-1 ring-black/5 dark:ring-white/10",
        isOpen 
          ? "w-full sm:w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] xl:w-3/4 h-[600px] max-h-[90vh] opacity-100 rounded-2xl transform-gpu" 
          : "w-0 h-0 opacity-0 pointer-events-none"
      )}
      style={{ 
        bottom: `${position.bottom}rem`, 
        left: '50%',
        transform: isOpen ? 'translateX(-50%)' : 'translateX(-50%) scale(0.95)',
        maxHeight: isOpen ? 'calc(100vh - 100px)' : '0',
        boxShadow: isOpen ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none'
      }}
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
  );
};

export default WalyChatPanel;
