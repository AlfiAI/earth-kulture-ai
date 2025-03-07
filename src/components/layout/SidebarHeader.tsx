
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, Earth } from "lucide-react";

interface SidebarHeaderProps {
  open: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const SidebarHeader = ({ open, onToggle, isMobile }: SidebarHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div
        className={cn(
          "flex items-center transition-all overflow-hidden",
          open ? "w-auto opacity-100" : "w-0 opacity-0"
        )}
      >
        <Earth className="h-6 w-6 text-primary" />
        <span className="ml-2 font-semibold whitespace-nowrap">
          EarthKulture AI
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={isMobile ? "flex" : "lg:flex hidden"}
      >
        <ChevronLeft
          className={cn(
            "h-5 w-5 transition-transform",
            !open && "rotate-180"
          )}
        />
      </Button>
    </div>
  );
};

export default SidebarHeader;
