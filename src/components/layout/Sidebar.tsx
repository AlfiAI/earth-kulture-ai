
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileSidebarToggle from "./MobileSidebarToggle";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const Sidebar = ({ open, onToggle }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile && open) {
      onToggle();
    }
  }, [location.pathname, isMobile, onToggle]);

  // Render a floating menu button when sidebar is closed on mobile
  if (isMobile && !open) {
    return <MobileSidebarToggle onToggle={onToggle} />;
  }

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-all pt-14 lg:pt-0",
        open ? "w-64" : "w-16",
        "lg:translate-x-0",
        isMobile && open ? "translate-x-0" : isMobile && !open ? "-translate-x-full" : "",
        isMobile ? "shadow-lg" : ""
      )}
    >
      <div className="h-full flex flex-col border-r bg-card px-3 py-4 overflow-y-auto">
        <SidebarHeader open={open} onToggle={onToggle} isMobile={isMobile} />
        <SidebarNavigation open={open} onToggle={onToggle} />
      </div>
    </aside>
  );
};

export default Sidebar;
