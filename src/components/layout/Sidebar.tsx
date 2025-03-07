
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
  Menu,
  BarChart3,
  Target
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const Sidebar = ({ open, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile && open) {
      onToggle();
    }
  }, [location.pathname, isMobile, onToggle]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('You have been logged out');
    window.location.href = '/auth';
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && open) {
      onToggle();
    }
  };

  // Render a floating menu button when sidebar is closed on mobile
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
      <div className="h-full flex flex-col border-r bg-card px-3 py-4 overflow-y-auto">
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
            onClick={() => handleNavigation('/dashboard')}
          />
          
          <NavItem
            to="/benchmarks"
            label="Benchmarking"
            icon={<BarChart3 className="h-5 w-5" />}
            active={location.pathname === '/benchmarks'}
            expanded={open}
            onClick={() => handleNavigation('/benchmarks')}
          />
          
          <NavItem
            to="/compliance"
            label="Compliance"
            icon={<FileCheck className="h-5 w-5" />}
            active={location.pathname === '/compliance'}
            expanded={open}
            onClick={() => handleNavigation('/compliance')}
          />
          
          <NavItem
            to="/insights"
            label="Insights"
            icon={<LightbulbIcon className="h-5 w-5" />}
            active={location.pathname === '/insights'}
            expanded={open}
            onClick={() => handleNavigation('/insights')}
          />
          
          <NavItem
            to="/goals"
            label="Goals"
            icon={<Target className="h-5 w-5" />}
            active={location.pathname === '/goals'}
            expanded={open}
            onClick={() => handleNavigation('/goals')}
          />
          
          <NavItem
            to="/reports"
            label="Reports"
            icon={<FileText className="h-5 w-5" />}
            active={location.pathname === '/reports'}
            expanded={open}
            onClick={() => handleNavigation('/reports')}
          />
          
          <NavItem
            to="/data"
            label="Data Center"
            icon={<Database className="h-5 w-5" />}
            active={location.pathname === '/data'}
            expanded={open}
            onClick={() => handleNavigation('/data')}
          />
          
          <NavItem
            to="/analytics"
            label="Analytics"
            icon={<AreaChart className="h-5 w-5" />}
            active={location.pathname === '/analytics'}
            expanded={open}
            onClick={() => handleNavigation('/analytics')}
          />
        </div>

        <div className="space-y-1 mt-auto">
          <NavItem
            to="/settings"
            label="Settings"
            icon={<Settings className="h-5 w-5" />}
            active={location.pathname === '/settings'}
            expanded={open}
            onClick={() => handleNavigation('/settings')}
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
  onClick?: () => void;
}

const NavItem = ({ to, label, icon, active, expanded, onClick }: NavItemProps) => {
  return (
    <NavLink to={to} className="block" onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    }}>
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
