
import DashboardLayout from "@/components/layout/DashboardLayout";
import MetricsSection from "@/components/analytics/MetricsSection";
import ChartTabsSection from "@/components/analytics/ChartTabsSection";
import PredictiveInsights from "@/components/predictive/PredictiveInsights";

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">ESG Analytics</h1>
        
        <MetricsSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ChartTabsSection />
          </div>
          <div>
            <PredictiveInsights />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
