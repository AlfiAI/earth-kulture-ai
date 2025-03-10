
import { ReactNode, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "./Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import MobileSidebarToggle from "./MobileSidebarToggle";
import SimpleChat from '@/components/chat/SimpleChat';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on first client mount to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen bg-background flex flex-col w-full">
        <Header />
        <div className="flex flex-1 pt-16">
          <AppSidebar />
          <main className="flex-1 transition-all duration-200">
            {children}
          </main>
        </div>
        
        {isMobile && (
          <MobileSidebarToggle />
        )}
        
        {/* Ensure chat is always mounted regardless of route */}
        <SimpleChat />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
