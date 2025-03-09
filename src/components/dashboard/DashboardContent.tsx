
import { useDashboard } from "@/contexts/dashboard/DashboardContext";
import CarbonFootprint from "./CarbonFootprint";
import DashboardESGScore from "./DashboardESGScore";
import ComplianceStatus from "./ComplianceStatus";
import ActivityFeed from "./ActivityFeed";
import AIInsights from "./AIInsights";
import PredictiveInsights from "@/components/predictive/PredictiveInsights";

const DashboardContent = () => {
  const { dashboardType } = useDashboard();

  return (
    <>
      {dashboardType === 'individual' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="carbon-footprint">
              <CarbonFootprint />
            </div>
            <div className="dashboard-esg-score">
              <DashboardESGScore />
            </div>
          </div>
          <div className="ai-insights">
            <AIInsights />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="dashboard-esg-score">
              <DashboardESGScore />
            </div>
            <div className="carbon-footprint">
              <CarbonFootprint />
            </div>
            <ComplianceStatus />
          </div>
          
          <div className="mb-6 ai-insights">
            <AIInsights />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <PredictiveInsights />
            </div>
            <div>
              <ActivityFeed />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardContent;
