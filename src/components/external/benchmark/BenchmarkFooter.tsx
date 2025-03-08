
import { ArrowDownIcon, ArrowUpIcon, MinusIcon, InfoIcon } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BenchmarkFooterProps {
  sourceText: string;
  metricUnit?: string;
  performanceText?: string;
  selectedMetricName?: string;
  performanceValue?: number;
  industryAverage?: number;
  historicalTrend?: 'improving' | 'declining' | 'stable';
  comparisonDetails?: string;
}

const BenchmarkFooter = ({ 
  sourceText, 
  metricUnit = 'Value', 
  performanceText = '12% better',
  selectedMetricName = 'this metric',
  performanceValue,
  industryAverage,
  historicalTrend = 'stable',
  comparisonDetails
}: BenchmarkFooterProps) => {
  
  const renderTrendIcon = () => {
    switch (historicalTrend) {
      case 'improving':
        return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <ArrowDownIcon className="h-4 w-4 text-red-600" />;
      case 'stable':
      default:
        return <MinusIcon className="h-4 w-4 text-amber-600" />;
    }
  };

  const getTrendText = () => {
    switch (historicalTrend) {
      case 'improving':
        return "Improving trend";
      case 'declining':
        return "Declining trend";
      case 'stable':
      default:
        return "Stable trend";
    }
  };

  return (
    <div className="mt-4 text-sm">
      <div className="flex justify-between text-muted-foreground">
        <span>{sourceText}</span>
        <span>
          Unit: {metricUnit}
        </span>
      </div>
      
      <div className="mt-2 space-y-1">
        <p className="flex items-center">
          Your company is <span className="mx-1 font-semibold text-green-600">{performanceText}</span> 
          than the industry average for {selectedMetricName}.
          
          {comparisonDetails && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="ml-1 h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{comparisonDetails}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </p>
        
        {performanceValue && industryAverage && (
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded">
            <span>Your value: <strong>{performanceValue}</strong> {metricUnit}</span>
            <span>Industry avg: <strong>{industryAverage}</strong> {metricUnit}</span>
          </div>
        )}
        
        <div className="flex items-center text-xs">
          <span className="mr-1 flex items-center">
            {renderTrendIcon()}
            <span className="ml-1">{getTrendText()}</span>
          </span>
          <span className="text-muted-foreground">
            {historicalTrend === 'improving' ? 'Keep up the good work!' : 
             historicalTrend === 'declining' ? 'Consider improvement strategies' : 
             'Maintaining consistent performance'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkFooter;
