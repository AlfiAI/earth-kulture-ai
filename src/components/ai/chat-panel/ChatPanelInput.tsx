
import { useRef } from 'react';
import { SendHorizonal, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChatPanelInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSend: () => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  placeholder?: string;
}

const ChatPanelInput = ({ inputValue, setInputValue, handleSend, inputRef, placeholder }: ChatPanelInputProps) => {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef || localRef;
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div 
      className="p-4 sm:p-6 border-t bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 rounded-b-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="relative max-w-5xl mx-auto">
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Ask Waly anything about ESG or carbon management..."}
          className={cn(
            "resize-none min-h-[60px] max-h-32 pr-14 rounded-xl",
            "border-gray-200 focus:border-primary focus:ring-primary",
            "placeholder:text-gray-400 transition-all duration-300 shadow-md",
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
            "text-base focus:shadow-primary/20"
          )}
          maxLength={500}
        />
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleSend}
            disabled={inputValue.trim() === ''}
            size="icon"
            className={cn(
              "absolute right-3 bottom-3 h-10 w-10 rounded-full",
              "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600",
              "transition-all duration-300 hover:shadow-md",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <SendHorizonal className="h-5 w-5 text-white" />
          </Button>
        </motion.div>
      </div>
      <motion.div 
        className="mt-3 text-xs text-muted-foreground text-center flex items-center justify-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <span>Powered by</span>
        <span className="font-medium text-primary flex items-center">
          EarthKulture AI <Sparkles className="h-3 w-3 ml-0.5 text-yellow-400 animate-float" />
        </span>
      </motion.div>
    </motion.div>
  );
};

export default ChatPanelInput;
