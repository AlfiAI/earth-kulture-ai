
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";

const InsightsBanner = () => {
  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-background border-primary/20">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Zap className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-1">AI-Powered ESG Insights</h2>
          <p className="text-muted-foreground mb-3">
            Waly Pro analyzes your sustainability data using DeepSeek-R1 to provide advanced insights, trend detection, and actionable recommendations.
          </p>
          <Button variant="default" size="sm" className="gap-1">
            <Zap className="h-4 w-4" />
            <span>Ask Waly Pro a Question</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default InsightsBanner;
