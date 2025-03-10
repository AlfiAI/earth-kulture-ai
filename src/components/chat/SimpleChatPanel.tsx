
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, SendHorizontal, Sparkles } from "lucide-react";
import SimpleMessage, { MessageProps } from "./SimpleMessage";
import { useState, useRef, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import TypingIndicator from "./TypingIndicator";

interface SimpleChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: MessageProps[];
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
}

const SimpleChatPanel = ({ 
  isOpen, 
  onClose, 
  messages, 
  onSendMessage,
  isTyping,
  messagesEndRef
}: SimpleChatPanelProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;
  
  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
      
      // Focus input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
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
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-lg h-[80vh] max-h-[600px]"
        >
          <Card className="w-full h-full flex flex-col overflow-hidden shadow-xl border border-primary/10 rounded-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/e48e0f44-7e54-4337-b0ea-8893795682ba.png" 
                    alt="Waly" 
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <h2 className="font-semibold text-xl text-white">Waly Chat Assistant</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50/50 to-white/80">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>How can I help you with your sustainability goals today?</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <SimpleMessage key={message.id} {...message} />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
            
            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative">
                <Textarea 
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about sustainability..." 
                  className={cn(
                    "min-h-[60px] resize-none rounded-xl pr-12",
                    "border-emerald-100 focus:border-emerald-300 focus:ring-emerald-200 focus:ring-opacity-50",
                    "placeholder:text-gray-400 transition-all duration-200 ease-in-out",
                    "shadow-sm"
                  )}
                  maxLength={500}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!inputValue.trim()}
                  className={cn(
                    "absolute right-2 bottom-2 rounded-full h-10 w-10",
                    "bg-gradient-to-r from-emerald-500 to-cyan-500",
                    "hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  size="icon"
                  aria-label="Send message"
                >
                  <SendHorizontal className="h-5 w-5 text-white" />
                </Button>
              </div>
              <div className="mt-3 text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                <span>Powered by</span>
                <span className="font-medium text-emerald-600 flex items-center">
                  EarthKulture AI <Sparkles className="h-3 w-3 ml-0.5 text-yellow-400" />
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SimpleChatPanel;
