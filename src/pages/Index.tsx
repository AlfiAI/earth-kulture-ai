
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import WalyAssistant from "@/components/ai/WalyAssistant";
import EnhancedWalyAssistant from "@/components/ai/EnhancedWalyAssistant";
import DashboardESGScore from "@/components/dashboard/DashboardESGScore";
import CarbonFootprint from "@/components/dashboard/CarbonFootprint";
import ComplianceStatus from "@/components/dashboard/ComplianceStatus";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import CarbonEmissionsTrend from "@/components/dashboard/CarbonEmissionsTrend";
import ESGScoreProgression from "@/components/dashboard/ESGScoreProgression";
import AIInsights from "@/components/dashboard/AIInsights";
import { useAuth } from '@/contexts/auth';

// Feature flag for enhanced assistant
const SHOW_ENHANCED_ASSISTANT = true;

const Index = () => {
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
  
  if (!mounted || isLoading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
  
  if (!isAuthenticated) {
    return null; // This will be redirected by the useEffect
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-16",
        isMobile ? "ml-0" : ""
      )}>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="container max-w-7xl mx-auto p-4 lg:p-6 pb-24">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
            <DashboardESGScore />
            <CarbonFootprint />
            <ComplianceStatus />
            <ActivityFeed />
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
            <CarbonEmissionsTrend />
            <ESGScoreProgression />
          </div>
          
          <AIInsights />
        </main>
      </div>
      
      {SHOW_ENHANCED_ASSISTANT ? (
        <EnhancedWalyAssistant initialOpen={false} />
      ) : (
        <WalyAssistant initialOpen={false} />
      )}
    </div>
  );
};

export default Index;
