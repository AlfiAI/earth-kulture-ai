
import DashboardLayout from "@/components/layout/DashboardLayout";
import AIInsights from "@/components/dashboard/AIInsights";
import PredictiveInsights from "@/components/predictive/PredictiveInsights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AIInsightsPage = () => {
  return (
    <DashboardLayout>
      <div className="px-3 py-4 md:p-6 max-w-7xl mx-auto overflow-x-hidden">
        <h1 className="text-xl md:text-2xl font-bold mb-4">AI Insights</h1>
        <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6">
          <AIInsights />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <PredictiveInsights />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI-powered risk assessment module is still in development. 
                Check back soon for advanced risk prediction capabilities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIInsightsPage;
