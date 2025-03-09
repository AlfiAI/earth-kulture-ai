
import { useRef } from 'react';
import { SendHorizonal, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSend: () => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  placeholder?: string;
}

const ChatInput = ({ inputValue, setInputValue, handleSend, inputRef, placeholder }: ChatInputProps) => {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef || localRef;
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 rounded-b-2xl">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Ask Waly anything about ESG or carbon management..."}
          className={cn(
            "resize-none min-h-[60px] max-h-32 pr-12 rounded-xl",
            "border-gray-200 focus:border-primary focus:ring-primary",
            "placeholder:text-gray-400 transition-all duration-200 shadow-sm",
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
            "text-base"
          )}
          maxLength={500}
        />
        <Button
          onClick={handleSend}
          disabled={inputValue.trim() === ''}
          size="icon"
          className={cn(
            "absolute right-3 bottom-3 h-8 w-8 rounded-full",
            "bg-gradient-to-r from-primary to-sky-500 hover:from-primary/90 hover:to-sky-500/90",
            "transition-all duration-200 hover:shadow-md",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <SendHorizonal className="h-4 w-4 text-white" />
        </Button>
      </div>
      <div className="mt-3 text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
        <span>Powered by</span>
        <span className="font-medium text-primary flex items-center">
          EarthKulture AI <Sparkles className="h-3 w-3 ml-0.5 text-yellow-400" />
        </span>
      </div>
    </div>
  );
};

export default ChatInput;
