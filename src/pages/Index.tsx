
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
  
  // Basic visibility check for Waly when dashboard loads
  useEffect(() => {
    console.log('Dashboard loaded, checking Waly visibility');
    
    // Create a simple container for Waly if none exists
    if (!document.getElementById('waly-container')) {
      console.log('Creating Waly container in dashboard');
      const container = document.createElement('div');
      container.id = 'waly-container';
      container.className = 'fixed bottom-0 right-0 z-[9999999]';
      container.style.cssText = `
        position: fixed !important;
        bottom: 2rem !important;
        right: 2rem !important;
        z-index: 9999999 !important;
        visibility: visible !important;
        display: block !important;
        opacity: 1 !important;
      `;
      document.body.appendChild(container);
    }
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
