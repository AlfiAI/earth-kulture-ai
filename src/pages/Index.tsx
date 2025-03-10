
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
  
  // Use the enhanced Waly injector
  useWalyInjector();
  
  // Additional safety check to ensure Waly is visible on the dashboard
  useEffect(() => {
    console.log('Dashboard loaded, ensuring Waly visibility');
    
    const ensureWalyVisibility = () => {
      // Force Waly container to be visible
      if (!document.getElementById('waly-container')) {
        console.log('Creating Waly container in dashboard component');
        const container = document.createElement('div');
        container.id = 'waly-container';
        container.style.cssText = `
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 99999999 !important;
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        `;
        document.body.appendChild(container);
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
    </DashboardLayout>
  );
}
