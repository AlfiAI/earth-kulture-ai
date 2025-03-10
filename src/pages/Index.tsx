
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
      // First check if the elements exist
      ['waly-container', 'chat-button'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          console.log(`Found ${id}, enforcing visibility`);
          el.setAttribute('style', `
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
            z-index: 9999999 !important;
            position: fixed !important;
            pointer-events: auto !important;
            transform: none !important;
            will-change: auto !important;
            transition: none !important;
            filter: none !important;
          `);
        } else {
          console.log(`${id} element not found, will be injected by useWalyInjector`);
        }
      });
      
      // Try to create if waly-container doesn't exist
      if (!document.getElementById('waly-container')) {
        const walyContainer = document.createElement('div');
        walyContainer.id = 'waly-container';
        walyContainer.className = 'fixed bottom-0 right-0 z-[9999999]';
        walyContainer.style.cssText = `
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
          z-index: 9999999 !important;
          position: fixed !important;
          bottom: 2rem !important;
          right: 2rem !important;
          pointer-events: auto !important;
        `;
        document.body.appendChild(walyContainer);
      }
    };
    
    // Execute multiple times with delays (more frequent)
    [0, 50, 100, 200, 300, 500, 1000, 2000, 5000].forEach(delay => {
      setTimeout(forceWalyVisibility, delay);
    });
    
    // Also trigger a custom event to let Waly components know they should be visible
    const event = new CustomEvent('waly-force-visibility');
    document.dispatchEvent(event);
    
    // Set up a periodic check for the first 30 seconds
    const interval = setInterval(() => {
      forceWalyVisibility();
      document.dispatchEvent(new CustomEvent('waly-force-visibility'));
    }, 300);
    
    // Clear the interval after 30 seconds
    setTimeout(() => {
      clearInterval(interval);
    }, 30000);
    
    return () => {
      clearInterval(interval);
    };
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
