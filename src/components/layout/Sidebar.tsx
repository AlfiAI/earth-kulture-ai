
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  LayoutDashboard, 
  AreaChart, 
  FileCheck, 
  LightbulbIcon, 
  Settings, 
  LogOut,
  FileText,
  Database,
  Earth,
  Bot,
  Menu
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('You have been logged out');
    window.location.href = '/auth';
  };

  if (isMobile && !open) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="fixed z-50 bottom-4 left-4 rounded-full shadow-lg bg-card"
      >
        <Menu className="h-5 w-5" />
      </Button>
    );
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
      <div className="h-full flex flex-col border-r bg-card px-3 py-4">
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

        <div className="space-y-1">
          <NavItem
            to="/dashboard"
            label="Dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            active={location.pathname === '/dashboard'}
            expanded={open}
          />
          
          <NavItem
            to="/compliance"
            label="Compliance"
            icon={<FileCheck className="h-5 w-5" />}
            active={location.pathname === '/compliance'}
            expanded={open}
          />
          
          <NavItem
            to="/insights"
            label="Insights"
            icon={<LightbulbIcon className="h-5 w-5" />}
            active={location.pathname === '/insights'}
            expanded={open}
          />
          
          <NavItem
            to="/reports"
            label="Reports"
            icon={<FileText className="h-5 w-5" />}
            active={location.pathname === '/reports'}
            expanded={open}
          />
          
          <NavItem
            to="/data"
            label="Data Center"
            icon={<Database className="h-5 w-5" />}
            active={location.pathname === '/data'}
            expanded={open}
          />
          
          <NavItem
            to="/analytics"
            label="Analytics"
            icon={<AreaChart className="h-5 w-5" />}
            active={location.pathname === '/analytics'}
            expanded={open}
          />
        </div>

        <div className="space-y-1 mt-auto">
          <NavItem
            to="/settings"
            label="Settings"
            icon={<Settings className="h-5 w-5" />}
            active={location.pathname === '/settings'}
            expanded={open}
          />
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start",
              open ? "px-3" : "px-0 justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {open && <span className="ml-2">Logout</span>}
          </Button>
        </div>

        <div className="mt-6 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full",
              open ? "justify-start px-3" : "justify-center px-0"
            )}
            onClick={() => {
              const walyButton = document.querySelector('[class*="fixed right-4 bottom-4 rounded-full"]') as HTMLButtonElement;
              if (walyButton) {
                walyButton.click();
              }
            }}
          >
            <Bot className="h-5 w-5 text-primary" />
            {open && <span className="ml-2">Ask Waly</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  expanded: boolean;
}

const NavItem = ({ to, label, icon, active, expanded }: NavItemProps) => {
  return (
    <NavLink to={to} className="block">
      <Button
        variant={active ? "default" : "ghost"}
        size="sm"
        className={cn(
          "w-full",
          expanded ? "justify-start px-3" : "justify-center px-0"
        )}
      >
        {icon}
        {expanded && <span className="ml-2">{label}</span>}
      </Button>
    </NavLink>
  );
};

export default Sidebar;
