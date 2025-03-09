
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
      <Card
        ref={ref}
        className={cn(
          "fixed shadow-xl border-primary/10 overflow-hidden transition-all duration-300 ease-in-out z-50 bg-card/95 backdrop-blur-sm",
          isOpen 
            ? "w-full h-[calc(100vh-60px)] max-h-[800px] opacity-100 rounded-none sm:rounded-2xl sm:w-[550px] md:w-[600px]" 
            : "w-0 h-0 opacity-0 pointer-events-none"
        )}
        style={{ 
          bottom: isOpen ? 0 : `${position.bottom}rem`, 
          right: isOpen ? 0 : `${position.right}rem`,
          left: isOpen ? 0 : 'auto',
          maxHeight: isOpen ? 'calc(100vh - 60px)' : '0'
        }}
      >
        <ChatHeader onClose={onClose} title="Waly Pro" subtitle="Advanced ESG Intelligence" />
        
        <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
          <EnhancedChatBanner />
          
          {messages.length === 0 && showNewChat && (
            <ConversationStarters 
              starters={starters} 
              onStarterClick={handleStarterClick}
              onNewChat={handleNewChat}
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
            placeholder="Ask about benchmarking, predictions, goals..."
          />
        </CardContent>
      </Card>
    );
  }
);

EnhancedChatPanel.displayName = 'EnhancedChatPanel';

export default EnhancedChatPanel;
