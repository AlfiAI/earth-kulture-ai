
import { Sparkles, MessageSquarePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnhancedChatToggleButtonProps {
  onClick: () => void;
  position: { bottom: number; right: number };
}

const EnhancedChatToggleButton = ({ onClick, position }: EnhancedChatToggleButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed rounded-full w-14 h-14 shadow-lg p-0 animate-in bg-primary text-white hover:bg-primary/90 z-50 transition-all duration-300",
        "flex items-center justify-center gap-1"
      )}
      style={{ 
        bottom: `${position.bottom}rem`, 
        right: `${position.right}rem` 
      }}
    >
      <Sparkles className="h-4 w-4 absolute -top-0.5 -right-0.5" />
      <MessageSquarePlus className="h-6 w-6" />
    </Button>
  );
};

export default EnhancedChatToggleButton;
