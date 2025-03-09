
import { Stars } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EnhancedChatToggleButtonProps {
  onClick: () => void;
  position: { bottom: number; right: number };
}

const EnhancedChatToggleButton = ({ onClick, position }: EnhancedChatToggleButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed rounded-full w-14 h-14 shadow-lg p-0 animate-in bg-primary text-white hover:bg-primary/90 z-50 transition-all duration-300"
      style={{ 
        bottom: `${position.bottom}rem`, 
        right: `${position.right}rem` 
      }}
    >
      <Stars className="h-6 w-6" />
    </Button>
  );
};

export default EnhancedChatToggleButton;
