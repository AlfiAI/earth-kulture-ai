
import { ReactNode } from 'react';
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

interface InsightsLayoutProps {
  children: ReactNode;
  sidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const InsightsLayout = ({ 
  children, 
  sidebarOpen, 
  isMobile, 
  toggleSidebar 
}: InsightsLayoutProps) => {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-16",
        isMobile ? "ml-0" : ""
      )}>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="container max-w-7xl mx-auto p-4 lg:p-6 pb-24">
          {children}
        </main>
      </div>
    </div>
  );
};

export default InsightsLayout;
