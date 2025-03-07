
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import WalyAssistant from "@/components/ai/WalyAssistant";
import DashboardESGScore from "@/components/dashboard/DashboardESGScore";
import CarbonFootprint from "@/components/dashboard/CarbonFootprint";
import ComplianceStatus from "@/components/dashboard/ComplianceStatus";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import CarbonEmissionsTrend from "@/components/dashboard/CarbonEmissionsTrend";
import ESGScoreProgression from "@/components/dashboard/ESGScoreProgression";
import AIInsights from "@/components/dashboard/AIInsights";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/auth');
      }
    } else {
      navigate('/auth');
    }
  }, [navigate]);
  
  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  if (!mounted) return null;
  
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
      
      <WalyAssistant initialOpen={false} />
    </div>
  );
};

export default Index;
