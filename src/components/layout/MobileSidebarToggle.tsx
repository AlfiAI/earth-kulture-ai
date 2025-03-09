
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

interface MobileSidebarToggleProps {
  onToggle?: () => void;
}

const MobileSidebarToggle = ({ onToggle }: MobileSidebarToggleProps) => {
  const { toggleSidebar } = useSidebar();

  const handleToggle = () => {
    toggleSidebar();
    if (onToggle) onToggle();
  };

  return (
    <Button
      variant="default"
      size="icon"
      onClick={handleToggle}
      className="fixed z-50 bottom-4 left-4 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};

export default MobileSidebarToggle;
