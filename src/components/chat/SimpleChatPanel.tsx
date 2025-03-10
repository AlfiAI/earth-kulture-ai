
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, SendHorizontal, Sparkles } from "lucide-react";
import SimpleMessage, { MessageProps } from "./SimpleMessage";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-lg h-[80vh]"
        >
          <Card className="w-full h-full flex flex-col overflow-hidden shadow-xl border border-primary/10 rounded-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h2 className="font-semibold text-lg text-white">Waly Chat Assistant</h2>
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
                </div>
              )}
            </ScrollArea>
            
            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <Textarea 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about sustainability..." 
                  className={cn(
                    "flex-1 min-h-[60px] resize-none rounded-xl",
                    "border-gray-200 focus:border-primary",
                    "placeholder:text-gray-400"
                  )}
                  maxLength={500}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!inputValue.trim()}
                  className={cn(
                    "self-end rounded-full h-10 w-10",
                    "bg-gradient-to-r from-emerald-500 to-cyan-500",
                    "hover:from-emerald-600 hover:to-cyan-600"
                  )}
                  size="icon"
                >
                  <SendHorizontal className="h-5 w-5 text-white" />
                </Button>
              </div>
              <div className="mt-3 text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                <span>Powered by</span>
                <span className="font-medium text-primary flex items-center">
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
