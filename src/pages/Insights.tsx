
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
      <div className="px-3 py-4 md:px-4 md:py-6 max-w-7xl mx-auto pb-24 overflow-x-hidden">
        <InsightsHeader onRefresh={handleRefresh} />
        <div className="mt-4 md:mt-6">
          <InsightsBanner />
        </div>
        <div className="mt-4 md:mt-6">
          <InsightsContent />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Insights;
