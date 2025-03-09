
import { ReactNode } from 'react';
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import { useSidebar } from "@/components/ui/sidebar/useSidebar";
import AppSidebar from "@/components/layout/AppSidebar";

interface InsightsLayoutProps {
  children: ReactNode;
}

const InsightsLayout = ({ children }: InsightsLayoutProps) => {
  const { open: sidebarOpen, isMobile } = useSidebar();
  
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-16",
        isMobile ? "ml-0" : ""
      )}>
        <Header />
        
        <main className="container max-w-7xl mx-auto p-4 lg:p-6 pb-24">
          {children}
        </main>
      </div>
    </div>
  );
};

export default InsightsLayout;
