
import { Stars } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EnhancedChatToggleButtonProps {
  onClick: () => void;
}

const EnhancedChatToggleButton = ({ onClick }: EnhancedChatToggleButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed right-4 bottom-4 rounded-full w-14 h-14 shadow-lg p-0 animate-in bg-primary text-white hover:bg-primary/90"
    >
      <Stars className="h-6 w-6" />
    </Button>
  );
};

export default EnhancedChatToggleButton;
