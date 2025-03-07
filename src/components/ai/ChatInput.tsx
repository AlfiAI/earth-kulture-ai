
import { useRef } from 'react';
import { ArrowUpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSend: () => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

const ChatInput = ({ inputValue, setInputValue, handleSend, inputRef }: ChatInputProps) => {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef || localRef;
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Waly anything about ESG or carbon management..."
          className="resize-none pr-10 min-h-[60px] max-h-32"
          maxLength={500}
        />
        <Button
          onClick={handleSend}
          disabled={inputValue.trim() === ''}
          size="icon"
          className="absolute right-2 bottom-2 h-6 w-6 rounded-full"
        >
          <ArrowUpCircle className="h-5 w-5" />
        </Button>
      </div>
      <div className="mt-2 text-xs text-muted-foreground text-center">
        Powered by EarthKulture AI
      </div>
    </div>
  );
};

export default ChatInput;
