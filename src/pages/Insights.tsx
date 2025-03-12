
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardLayout from "@/components/layout/DashboardLayout";
import InsightsHeader from "@/components/insights/InsightsHeader";
import InsightsBanner from "@/components/insights/InsightsBanner";
import InsightsContent from "@/components/insights/InsightsContent";

const Insights = () => {
  const handleRefresh = () => {
    // In the future, this could fetch new insights from the API
    console.log('Refreshing insights...');
  };

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto px-4 py-6 pb-24">
        <InsightsHeader onRefresh={handleRefresh} />
        <div className="mt-6">
          <InsightsBanner />
        </div>
        <div className="mt-6">
          <InsightsContent />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Insights;
