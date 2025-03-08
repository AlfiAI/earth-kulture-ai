
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MetricsSection from "@/components/analytics/MetricsSection";
import ChartTabsSection from "@/components/analytics/ChartTabsSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

const Analytics = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Redirect to auth page if not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  if (!mounted || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // This will be redirected by the useEffect
  }

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
