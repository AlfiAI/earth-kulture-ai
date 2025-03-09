
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  FileText,
  Settings,
  Upload,
  MessageSquare,
  FileBarChart,
  BookOpen,
  HelpCircle,
  Globe,
  Gauge,
  ListChecks,
  Scale,
  TrendingUp,
  Building,
  LightbulbIcon
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface SidebarProps {
  isCollapsed: boolean;
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const { pathname } = useLocation();

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: <Gauge className="h-5 w-5" />,
      href: "/dashboard",
    },
    {
      title: "Analytics",
      icon: <BarChart className="h-5 w-5" />,
      href: "/analytics",
    },
    {
      title: "Compliance",
      icon: <ListChecks className="h-5 w-5" />,
      href: "/compliance",
    },
    {
      title: "AI Insights",
      icon: <LightbulbIcon className="h-5 w-5" />,
      href: "/ai-insights",
    },
    {
      title: "Insights",
      icon: <TrendingUp className="h-5 w-5" />,
      href: "/insights",
    },
    {
      title: "Industry Benchmarks",
      icon: <Building className="h-5 w-5" />,
      href: "/benchmark",
    },
    {
      title: "External Data",
      icon: <Globe className="h-5 w-5" />,
      href: "/external-data",
    },
    {
      title: "Data Management",
      icon: <Upload className="h-5 w-5" />,
      href: "/data",
    },
    {
      title: "Sustainability Goals",
      icon: <FileBarChart className="h-5 w-5" />,
      href: "/goals",
    },
    {
      title: "Reports",
      icon: <FileText className="h-5 w-5" />,
      href: "/reports",
    },
    {
      title: "AI Assistant",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/ai-assistant",
    },
    {
      title: "Documentation",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/documentation",
    },
    {
      title: "Support",
      icon: <HelpCircle className="h-5 w-5" />,
      href: "/support",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/settings",
    },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-sidebar-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[60px] hover:w-64 group" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b px-4">
        <Link to="/" className="flex items-center">
          <Globe className="h-6 w-6 text-primary" />
          <span className={cn(
            "ml-2 text-xl font-bold transition-opacity duration-200",
            isCollapsed ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          )}>
            Earth Kulture
          </span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-1 px-2">
          <TooltipProvider delayDuration={0}>
            {sidebarItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "justify-start transition-all duration-300",
                      isCollapsed ? "justify-center group-hover:justify-start" : "justify-start"
                    )}
                  >
                    <Link to={item.href} className="flex items-center w-full">
                      {item.icon}
                      <span className={cn(
                        "ml-2 truncate transition-opacity duration-300",
                        isCollapsed ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                      )}>
                        {item.title}
                      </span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </ScrollArea>
    </aside>
  );
}

export default Sidebar;
