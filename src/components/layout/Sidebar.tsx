
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  Gauge,
  BarChart,
  Upload,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  Globe,
  FileBarChart,
  BookOpen,
  ListChecks,
  TrendingUp,
  Building,
  LightbulbIcon
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const sidebarItems = [
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
    <aside className={cn(
      "fixed inset-y-0 left-0 z-10 flex flex-col border-r border-border/40 bg-background shadow-sm transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      "md:relative md:z-0"
    )}>
      <div className="flex h-16 items-center border-b px-4">
        <Link to="/" className="flex items-center">
          <Globe className="h-6 w-6 text-primary" />
          {!isCollapsed && (
            <span className="ml-2 text-xl font-bold">
              Earth Kulture
            </span>
          )}
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.icon}
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.title}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="border-t p-4">
        {!isCollapsed && (
          <Link
            to="/help"
            className="flex w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Need Help?
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
