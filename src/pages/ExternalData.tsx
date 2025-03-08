import { useState } from 'react';
import { Globe } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import EnhancedWalyAssistant from "@/components/ai/EnhancedWalyAssistant";
import ESGRegulationsList from "@/components/external/ESGRegulationsList";
import ESGBenchmarkCard from "@/components/external/ESGBenchmarkCard";

const ExternalData = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar isCollapsed={!sidebarOpen} />
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-16",
        isMobile && "ml-0"
      )}>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="container max-w-7xl mx-auto p-4 lg:p-6 pb-24">
          <div className="flex items-center mb-6">
            <Globe className="h-6 w-6 mr-2" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">External ESG Data</h1>
              <p className="text-muted-foreground">
                Regulatory updates, benchmarks, and industry data
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="lg:col-span-2">
              <ESGRegulationsList />
            </div>
          </div>
          
          <div className="mb-6">
            <ESGBenchmarkCard />
          </div>
        </main>
      </div>
      
      <EnhancedWalyAssistant initialOpen={false} />
    </div>
  );
};

export default ExternalData;
