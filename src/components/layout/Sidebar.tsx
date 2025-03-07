
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Globe, 
  Home, 
  LineChart, 
  ClipboardCheck, 
  Settings, 
  Users, 
  Zap, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const Sidebar = ({ open, onToggle }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;

  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/',
    },
    {
      title: 'AI Insights',
      icon: Zap,
      href: '/insights',
    },
    {
      title: 'Compliance',
      icon: ClipboardCheck,
      href: '/compliance',
    },
    {
      title: 'Team',
      icon: Users,
      href: '/team',
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/settings',
    },
  ];

  const sidebarWidth = open ? 'w-64' : 'w-16';
  
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col border-r border-border/40 bg-sidebar transition-all duration-300 ease-in-out",
          sidebarWidth,
          isMobile && !open && "transform -translate-x-full",
          isMobile && open && "transform translate-x-0 w-64",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border/40">
          <Link to="/" className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary animate-pulse-gentle" />
            <span className={cn(
              "font-semibold text-xl tracking-tight transition-opacity duration-200",
              !open && "opacity-0 w-0"
            )}>
              Earth Kulture
            </span>
          </Link>
          
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className={cn(
                "h-8 w-8 rounded-full",
                !open && "rotate-180"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}
        </div>

        <ScrollArea>
          <div className="space-y-2 py-4 px-2">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-primary"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-sidebar-foreground")} />
                  <span className={cn(
                    "transition-opacity duration-200",
                    !open && "opacity-0 w-0"
                  )}>
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </ScrollArea>

        <div className="mt-auto p-4 border-t border-border/40">
          <div className={cn(
            "flex items-center gap-2 transition-opacity duration-200 text-xs text-muted-foreground",
            !open && "opacity-0"
          )}>
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>All systems operational</span>
          </div>
        </div>
      </aside>
      
      {/* Mobile overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-10 bg-black/50 transition-opacity"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
