
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  ChevronDown, 
  Menu, 
  Globe, 
  Settings,
  LogOut
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
import { cn } from "@/lib/utils";

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header = ({ toggleSidebar, sidebarOpen }: HeaderProps) => {
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();
  
  // Get the current page title based on the route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/insights') return 'AI Insights';
    if (path === '/compliance') return 'Compliance';
    if (path === '/settings') return 'Settings';
    
    return 'Earth Kulture';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex items-center gap-2 lg:gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {!sidebarOpen && (
          <Link to="/" className="hidden lg:flex items-center gap-2 transition-opacity duration-200">
            <Globe className="h-6 w-6 text-primary animate-pulse-gentle" />
            <span className="font-semibold text-xl tracking-tight">Earth Kulture</span>
          </Link>
        )}

        <div className="hidden md:flex h-10 w-px bg-border mx-1" />

        <h1 className={cn(
          "text-xl font-medium transition-all duration-200",
          sidebarOpen ? "lg:ml-0" : "lg:ml-2"
        )}>
          {getPageTitle()}
        </h1>
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
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
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
