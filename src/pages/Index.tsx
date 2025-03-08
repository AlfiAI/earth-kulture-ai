
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardESGScore from "@/components/dashboard/DashboardESGScore";
import CarbonFootprint from "@/components/dashboard/CarbonFootprint";
import ComplianceStatus from "@/components/dashboard/ComplianceStatus";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import AIInsights from "@/components/dashboard/AIInsights";
import PredictiveInsights from "@/components/predictive/PredictiveInsights";

export default function Index() {
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };
  
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">ESG Dashboard</h1>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <DashboardESGScore />
          <CarbonFootprint />
          <ComplianceStatus />
        </div>
        
        {/* AI Insights */}
        <AIInsights />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <PredictiveInsights />
          </div>
          <div className="md:col-span-1">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
