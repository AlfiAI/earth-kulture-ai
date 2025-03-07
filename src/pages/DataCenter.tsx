
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import WalyAssistant from "@/components/ai/WalyAssistant";
import DataHeader from "@/components/data/DataHeader";
import DataSourceCard from "@/components/data/DataSourceCard";
import DataValidation from "@/components/data/DataValidation";

const DataCenter = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-16",
        isMobile && "ml-0"
      )}>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="container max-w-7xl mx-auto p-4 lg:p-6 pb-24">
          <DataHeader 
            title="Data Management" 
            subtitle="AI-powered data processing for ESG & carbon tracking" 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DataSourceCard />
            <DataValidation />
          </div>
        </main>
      </div>
      
      <WalyAssistant initialOpen={false} />
    </div>
  );
};

export default DataCenter;
