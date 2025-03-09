
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardProvider } from "@/contexts/dashboard/DashboardContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import IndustryContextCard from "@/components/dashboard/IndustryContextCard";
import EnterpriseTabs from "@/components/dashboard/EnterpriseTabs";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardTour from "@/components/dashboard/DashboardTour";
import { useAuth } from "@/contexts/auth";

export default function Index() {
  const { userProfile } = useAuth();
  const isEnterprise = userProfile?.dashboard_preference === 'enterprise';

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
