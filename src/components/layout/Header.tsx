
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  Settings,
  LogOut,
  Globe
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar/useSidebar";

const Header = () => {
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();
  const { toggleSidebar } = useSidebar();
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/insights') return 'AI Insights';
    if (path === '/compliance') return 'Compliance';
    if (path === '/analytics') return 'Analytics';
    if (path === '/reports') return 'Reports';
    if (path === '/data') return 'Data Center';
    if (path === '/settings') return 'Settings';
    
    // Return empty string for pages that shouldn't display a title
    return '';
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('You have been logged out');
    window.location.href = '/auth';
  };

  const pageTitle = getPageTitle();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex items-center gap-2 lg:gap-3">
        <SidebarTrigger className="lg:hidden" onClick={toggleSidebar} />

        <div className="flex items-center">
          <Globe className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold">Earth Kulture</span>
        </div>

        <div className="hidden md:flex h-10 w-px bg-border mx-1" />

        {pageTitle && (
          <h1 className="text-xl font-medium transition-all duration-200">
            {pageTitle}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-medium">
                {notifications}
              </span>
            )}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg" alt="User avatar" />
                <AvatarFallback className="bg-primary/10 text-primary">EK</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 animate-in slide-in-right">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">admin@earthkulture.ai</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
