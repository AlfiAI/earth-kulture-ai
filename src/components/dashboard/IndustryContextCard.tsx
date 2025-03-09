
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/contexts/dashboard/DashboardContext";

const IndustryContextCard = () => {
  const { industryContext } = useDashboard();

  if (!industryContext) return null;

  return (
    <Card className="mb-6 bg-muted/50">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Relevant Frameworks</h3>
            <ul className="text-xs space-y-1">
              {industryContext.relevantFrameworks.slice(0, 3).map((framework: string, index: number) => (
                <li key={index} className="text-muted-foreground">{framework}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Key Metrics</h3>
            <ul className="text-xs space-y-1">
              {industryContext.keyMetrics.slice(0, 3).map((metric: string, index: number) => (
                <li key={index} className="text-muted-foreground">{metric}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Regulatory Focus</h3>
            <ul className="text-xs space-y-1">
              {industryContext.regulatoryFocus.slice(0, 3).map((focus: string, index: number) => (
                <li key={index} className="text-muted-foreground">{focus}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Benchmarking</h3>
            <ul className="text-xs space-y-1">
              {industryContext.benchmarkComparisons.slice(0, 3).map((benchmark: string, index: number) => (
                <li key={index} className="text-muted-foreground">{benchmark}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryContextCard;
