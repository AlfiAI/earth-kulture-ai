
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MetricsSection from "@/components/analytics/MetricsSection";
import ChartTabsSection from "@/components/analytics/ChartTabsSection";
import { useIsMobile } from "@/hooks/use-mobile";

const Analytics = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-background">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="flex pt-16">
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className={`flex-1 transition-all duration-200 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"} ${isMobile ? "ml-0" : ""}`}>
          <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground">
                Detailed analysis and trends of your sustainability metrics.
              </p>
            </div>

            <MetricsSection />
            <ChartTabsSection />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
