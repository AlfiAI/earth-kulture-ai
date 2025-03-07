
import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  AreaChart, 
  FileCheck, 
  LightbulbIcon, 
  Settings, 
  LogOut,
  FileText,
  Database,
  Bot,
  BarChart3,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth"; // Updated import path
import NavItem from "./NavItem";
import { cn } from "@/lib/utils";

interface SidebarNavigationProps {
  open: boolean;
  onToggle: () => void;
}

const SidebarNavigation = ({ open, onToggle }: SidebarNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && open) {
      onToggle();
    }
  };

  return (
    <>
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
          onClick={signOut}
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
    </>
  );
};

export default SidebarNavigation;
