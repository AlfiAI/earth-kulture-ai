
import { useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardProvider } from "@/contexts/dashboard/DashboardContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import IndustryContextCard from "@/components/dashboard/IndustryContextCard";
import EnterpriseTabs from "@/components/dashboard/EnterpriseTabs";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { useAuth } from "@/contexts/auth";
import SimpleChat from '@/components/chat/SimpleChat';

export default function Index() {
  const { userProfile } = useAuth();
  const isEnterprise = userProfile?.dashboard_preference === 'enterprise';
  
  // Debug visibility
  useEffect(() => {
    console.log('Index page loaded with SimpleChat integration');
    
    // Add a visible marker to check if page is rendering properly
    const marker = document.createElement('div');
    marker.id = 'index-page-marker';
    marker.style.position = 'fixed';
    marker.style.top = '0';
    marker.style.left = '0';
    marker.style.width = '5px';
    marker.style.height = '5px';
    marker.style.backgroundColor = 'red';
    marker.style.zIndex = '999999';
    document.body.appendChild(marker);
    
    return () => {
      if (document.getElementById('index-page-marker')) {
        document.body.removeChild(document.getElementById('index-page-marker')!);
      }
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
        </DashboardProvider>
      </div>
      
      {/* New simplified chat component */}
      <SimpleChat />
    </DashboardLayout>
  );
}
