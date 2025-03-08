
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";

interface InsightsHeaderProps {
  onRefresh: () => void;
}

const InsightsHeader = ({ onRefresh }: InsightsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground">AI-powered recommendations and analysis</p>
      </div>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
        <Button variant="default" size="sm" className="h-9 gap-1" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Insights</span>
        </Button>
      </div>
    </div>
  );
};

export default InsightsHeader;
