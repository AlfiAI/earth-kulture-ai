
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MobileSidebarToggleProps {
  onToggle: () => void;
}

const MobileSidebarToggle = ({ onToggle }: MobileSidebarToggleProps) => {
  return (
    <Button
      variant="default"
      size="icon"
      onClick={onToggle}
      className="fixed z-50 bottom-4 left-4 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};

export default MobileSidebarToggle;
