
import { MessageSquarePlus, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface WalyChatButtonProps {
  onClick: () => void;
  position: { bottom: number; right: number };
}

const WalyChatButton = ({ onClick, position }: WalyChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed rounded-full w-16 h-16 shadow-xl bg-gradient-to-r from-primary to-sky-500 text-white hover:bg-primary/90 flex items-center justify-center z-50 transition-all duration-300 animate-pulse-gentle"
      style={{ bottom: `${position.bottom}rem`, right: `${position.right}rem` }}
    >
      <div className="relative">
        <MessageSquarePlus className="h-7 w-7" />
        <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-float" />
      </div>
    </Button>
  );
};

export default WalyChatButton;
