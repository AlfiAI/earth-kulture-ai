
import { useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardProvider } from "@/contexts/dashboard/DashboardContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import IndustryContextCard from "@/components/dashboard/IndustryContextCard";
import EnterpriseTabs from "@/components/dashboard/EnterpriseTabs";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardTour from "@/components/dashboard/DashboardTour";
import { useAuth } from "@/contexts/auth";
import { useWalyInjector } from '@/hooks/use-waly-injector';

export default function Index() {
  const { userProfile } = useAuth();
  const isEnterprise = userProfile?.dashboard_preference === 'enterprise';
  
  // Use the injector hook to ensure Waly is available
  useWalyInjector();
  
  // Force visibility of Waly when dashboard loads
  useEffect(() => {
    console.log('Dashboard loaded, forcing Waly visibility');
    
    const forceWalyVisibility = () => {
      ['waly-container', 'chat-button'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.setAttribute('style', `
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
            z-index: 9999999 !important;
            position: fixed !important;
            pointer-events: auto !important;
            transform: none !important;
          `);
        }
      });
    };
    
    // Execute multiple times with delays
    [0, 100, 500, 1000, 2000, 5000].forEach(delay => {
      setTimeout(forceWalyVisibility, delay);
    });
    
    // Also trigger a custom event to let Waly components know they should be visible
    const event = new CustomEvent('waly-force-visibility');
    document.dispatchEvent(event);
    
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
    </DashboardLayout>
  );
}
