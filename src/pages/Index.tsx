
import { useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardProvider } from "@/contexts/dashboard/DashboardContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import IndustryContextCard from "@/components/dashboard/IndustryContextCard";
import EnterpriseTabs from "@/components/dashboard/EnterpriseTabs";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardTour from "@/components/dashboard/DashboardTour";
import { useAuth } from "@/contexts/auth";
import WalyAssistant from '@/components/ai/WalyAssistant';

export default function Index() {
  const { userProfile } = useAuth();
  const isEnterprise = userProfile?.dashboard_preference === 'enterprise';
  
  // Ensure Waly visibility on the dashboard
  useEffect(() => {
    console.log('Dashboard loaded, ensuring Waly visibility');
    
    const ensureWalyVisibility = () => {
      // Check for Waly container
      const walyContainer = document.getElementById('waly-assistant-container');
      
      if (!walyContainer) {
        console.log('No Waly container found, rendering WalyAssistant in Index');
      }
    };
    
    // Run immediately
    ensureWalyVisibility();
    
    // Run periodically
    const interval = setInterval(ensureWalyVisibility, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <DashboardProvider>
          <div className="dashboard-header">
            <DashboardHeader />
          </div>
          
          <div className="industry-context-card">
            <IndustryContextCard />
          </div>
          
          {isEnterprise && <EnterpriseTabs />}
          
          <DashboardContent />
          
          {/* Tour component */}
          <DashboardTour />
        </DashboardProvider>
      </div>
      
      {/* Directly render WalyAssistant in the Index page */}
      <div id="waly-container" style={{ 
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999999,
        visibility: 'visible',
        display: 'block'
      }}>
        <WalyAssistant initialOpen={false} />
      </div>
    </DashboardLayout>
  );
}
