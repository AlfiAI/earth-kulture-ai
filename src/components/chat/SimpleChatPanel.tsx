
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send } from "lucide-react";
import SimpleMessage, { MessageProps } from "./SimpleMessage";
import { useState } from "react";

interface SimpleChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: MessageProps[];
  onSendMessage: (message: string) => void;
}

const SimpleChatPanel = ({ isOpen, onClose, messages, onSendMessage }: SimpleChatPanelProps) => {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;
  
  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg h-[80vh] flex flex-col overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
          <h2 className="font-semibold text-lg">Chat Assistant</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary/90">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Messages */}
        <ScrollArea className="flex-1 p-4 bg-background">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>How can I help you today?</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <SimpleMessage key={message.id} {...message} />
              ))}
            </div>
          )}
        </ScrollArea>
        
        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..." 
              className="flex-1 min-h-[60px] resize-none"
              maxLength={500}
            />
            <Button 
              onClick={handleSend} 
              disabled={!inputValue.trim()}
              className="self-end"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SimpleChatPanel;
