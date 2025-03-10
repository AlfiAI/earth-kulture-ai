
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
  
  // Debug Waly visibility
  useEffect(() => {
    console.log('Index page loaded, ensuring Waly visibility');
    
    // Function to directly force Waly visibility with aggressive styling
    const forceWalyVisibility = () => {
      const walyContainer = document.getElementById('waly-assistant-container');
      const chatButton = document.getElementById('chat-button');
      
      if (walyContainer) {
        console.log('Found Waly container, forcing visibility');
        walyContainer.style.cssText = `
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 9999999 !important;
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        `;
      } else {
        console.log('No Waly container found');
      }
      
      if (chatButton) {
        console.log('Found chat button, forcing visibility');
        chatButton.style.cssText = `
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 9999999 !important;
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        `;
      }
    };
    
    // Run immediately and on interval to ensure continuous visibility
    forceWalyVisibility();
    const interval = setInterval(forceWalyVisibility, 500);
    
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
      
      {/* Directly render WalyAssistant with a high z-index container */}
      <div id="waly-root-container" style={{ 
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999999,
        visibility: 'visible',
        display: 'block',
        pointerEvents: 'auto'
      }}>
        <WalyAssistant initialOpen={false} />
      </div>
    </DashboardLayout>
  );
}
