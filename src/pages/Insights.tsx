
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from '@/contexts/auth';
import EnhancedWalyAssistant from "@/components/ai/EnhancedWalyAssistant";
import InsightsHeader from "@/components/insights/InsightsHeader";
import InsightsBanner from "@/components/insights/InsightsBanner";
import InsightsContent from "@/components/insights/InsightsContent";
import InsightsLayout from "@/components/insights/InsightsLayout";

const Insights = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Check if user is authenticated
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  if (!mounted || !isAuthenticated) {
    return null;
  }
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const handleRefresh = () => {
    // In the future, this could fetch new insights from the API
    console.log('Refreshing insights...');
  };

  return (
    <InsightsLayout 
      sidebarOpen={sidebarOpen}
      isMobile={isMobile}
      toggleSidebar={toggleSidebar}
    >
      <InsightsHeader onRefresh={handleRefresh} />
      <InsightsBanner />
      <InsightsContent />
      <EnhancedWalyAssistant initialOpen={false} />
    </InsightsLayout>
  );
};

export default Insights;
