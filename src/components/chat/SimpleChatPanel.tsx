
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, SendHorizontal, Sparkles, MessageSquare, Zap } from "lucide-react";
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

  // Suggested prompts for empty state
  const suggestedPrompts = [
    "How can I reduce my carbon footprint?",
    "Explain ESG reporting best practices",
    "What are the latest sustainability trends?",
    "Help me track my company's emissions"
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-lg h-[80vh] max-h-[600px]"
        >
          <Card className="w-full h-full flex flex-col overflow-hidden shadow-xl border border-emerald-100/30 rounded-2xl">
            {/* Header */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                  className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <img 
                    src="/lovable-uploads/e48e0f44-7e54-4337-b0ea-8893795682ba.png" 
                    alt="Waly" 
                    className="h-8 w-8 object-contain"
                  />
                </motion.div>
                <div>
                  <motion.h2 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="font-semibold text-xl text-white flex items-center"
                  >
                    Waly AI <Sparkles className="h-3.5 w-3.5 ml-1.5 text-yellow-300" />
                  </motion.h2>
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="text-xs text-white/80"
                  >
                    Your ESG Intelligence Assistant
                  </motion.p>
                </div>
              </div>
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50/50 to-white/80">
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="h-full flex flex-col items-center justify-center text-muted-foreground p-6"
                >
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-emerald-500" />
                  </div>
                  <p className="text-center mb-6">Ask Waly about sustainability, ESG reporting, or carbon management</p>
                  
                  <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                    {suggestedPrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + (index * 0.1), duration: 0.3 }}
                        className="text-left text-sm p-3 rounded-xl border border-emerald-100 bg-white hover:bg-emerald-50 transition-colors flex items-start gap-2"
                        onClick={() => onSendMessage(prompt)}
                      >
                        <Zap className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-gray-700">{prompt}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {messages.map((message) => (
                    <SimpleMessage key={message.id} {...message} />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </ScrollArea>
            
            {/* Input */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-4 bg-white border-t border-gray-100"
            >
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleSend} 
                    disabled={!inputValue.trim()}
                    className={cn(
                      "absolute right-2 bottom-2 rounded-full h-10 w-10",
                      "bg-gradient-to-r from-emerald-500 to-cyan-500",
                      "hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "shadow-md"
                    )}
                    size="icon"
                    aria-label="Send message"
                  >
                    <SendHorizontal className="h-5 w-5 text-white" />
                  </Button>
                </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mt-3 text-xs text-muted-foreground text-center flex items-center justify-center gap-1"
              >
                <span>Powered by</span>
                <span className="font-medium text-emerald-600 flex items-center">
                  EarthKulture AI <Sparkles className="h-3 w-3 ml-0.5 text-yellow-400 animate-pulse" />
                </span>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SimpleChatPanel;
