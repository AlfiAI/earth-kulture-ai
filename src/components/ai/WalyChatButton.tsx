
import { Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WalyChatButtonProps {
  onClick: () => void;
  position: { bottom: number; right: number };
}

const WalyChatButton = ({ onClick, position }: WalyChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed rounded-full w-16 h-16 shadow-xl text-white z-50 transition-all duration-300 overflow-hidden",
        "bg-gradient-to-r from-sky-500 to-primary hover:from-sky-500/90 hover:to-primary/90",
        "hover:scale-105 hover:shadow-primary/20 hover:shadow-2xl"
      )}
      style={{ bottom: `${position.bottom}rem`, right: `${position.right}rem` }}
    >
      <div className="relative flex items-center justify-center">
        <img 
          src="/lovable-uploads/664bce6b-c58c-464b-b306-64594271cbdc.png" 
          alt="Waly Bot" 
          className="h-12 w-12 object-contain"
        />
        <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-float" />
      </div>
    </Button>
  );
};

export default WalyChatButton;
