
import { RefObject } from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
        "fixed shadow-xl border-primary/10 overflow-hidden transition-all duration-300 ease-in-out z-50 bg-card/95 backdrop-blur-sm",
        isOpen ? "w-80 sm:w-96 h-[600px] max-h-[80vh] opacity-100 rounded-2xl" : "w-0 h-0 opacity-0 pointer-events-none"
      )}
      style={{ 
        bottom: `${position.bottom}rem`, 
        right: `${position.right}rem`,
        maxHeight: isOpen ? 'calc(100vh - 100px)' : '0'
      }}
    >
      <ChatHeader 
        onClose={onClose} 
        title="Waly AI" 
        subtitle="ESG & Carbon Intelligence" 
      />
      
      <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
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
      </CardContent>
    </Card>
  );
};

export default WalyChatPanel;
