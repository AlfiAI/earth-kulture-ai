
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  FileText,
  Settings,
  Upload,
  Users,
  MessageSquare,
  FileBarChart,
  BookOpen,
  HelpCircle,
  Globe,
  Gauge,
  ListChecks,
  Scale,
  TrendingUp,
  Building
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  isCollapsed: boolean;
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  submenu?: { title: string; href: string }[];
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
      title: "AI Benchmarking",
      icon: <TrendingUp className="h-5 w-5" />,
      href: "/benchmarking",
    },
    {
      title: "Industry Benchmark",
      icon: <Building className="h-5 w-5" />,
      href: "/benchmark-dashboard",
    },
    {
      title: "Data Management",
      icon: <Upload className="h-5 w-5" />,
      href: "/data-management",
    },
    {
      title: "ESG Reports",
      icon: <FileText className="h-5 w-5" />,
      href: "/esg-reports",
    },
    {
      title: "AI Assistant",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/ai-assistant",
    },
    {
      title: "Carbon Calculator",
      icon: <BarChart className="h-5 w-5" />,
      href: "/carbon-calculator",
    },
    {
      title: "Compliance Frameworks",
      icon: <ListChecks className="h-5 w-5" />,
      href: "/compliance-frameworks",
    },
    {
      title: "Regulatory Updates",
      icon: <Scale className="h-5 w-5" />,
      href: "/regulatory-updates",
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
      title: "User Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/user-settings",
    },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[60px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b px-4">
        <Link to="/" className="flex items-center">
          <Globe className="h-6 w-6 text-primary" />
          {!isCollapsed && (
            <span className="ml-2 text-xl font-bold">Earth Kulture</span>
          )}
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
                      "justify-start",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Link to={item.href} className="flex items-center">
                      {item.icon}
                      {!isCollapsed && (
                        <span className="ml-2 truncate">{item.title}</span>
                      )}
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
