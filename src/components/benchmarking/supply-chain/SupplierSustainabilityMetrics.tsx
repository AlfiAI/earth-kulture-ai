
import { SustainabilityMetrics } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface SupplierSustainabilityMetricsProps {
  metrics: SustainabilityMetrics | null;
  isLoading: boolean;
}

const SupplierSustainabilityMetrics = ({ metrics, isLoading }: SupplierSustainabilityMetricsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No sustainability metrics available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sustainability Overview</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Environmental:</span>
          <span>{metrics.environmental}%</span>
        </div>
        <Progress value={metrics.environmental} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Social:</span>
          <span>{metrics.social}%</span>
        </div>
        <Progress value={metrics.social} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Governance:</span>
          <span>{metrics.governance}%</span>
        </div>
        <Progress value={metrics.governance} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Overall:</span>
          <span className="font-medium">{metrics.overall}%</span>
        </div>
        <Progress value={metrics.overall} className="h-2" />
      </div>
      
      <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
        <p>Based on data from Open Supply Hub and internal assessments.</p>
      </div>
    </div>
  );
};

export default SupplierSustainabilityMetrics;
