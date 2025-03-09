
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
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
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
  const { pathname } = useLocation();
  const { state } = useSidebar();

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
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center h-16 px-4 border-b">
          <Link to="/" className="flex items-center">
            <Globe className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-bold">
              Earth Kulture
            </span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link to={item.href}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col px-4 py-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/help">Need Help?</Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
