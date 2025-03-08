
import { AlertTriangle, ArrowDownIcon, ArrowUpIcon, MinusIcon, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { RiskPrediction } from "@/services/ai/riskPredictionService";

interface RiskPredictionCardProps {
  prediction: RiskPrediction;
  className?: string;
}

const RiskPredictionCard = ({ prediction, className }: RiskPredictionCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRiskColor = (score: number) => {
    if (score < 33) return 'bg-green-500';
    if (score < 66) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getRiskText = (score: number) => {
    if (score < 33) return 'Low Risk';
    if (score < 66) return 'Medium Risk';
    return 'High Risk';
  };

  const getTrendIcon = () => {
    switch (prediction.trend) {
      case 'increasing':
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
      case 'stable':
      default:
        return <MinusIcon className="h-4 w-4 text-amber-500" />;
    }
  };

  const getTrendText = () => {
    switch (prediction.trend) {
      case 'increasing':
        return "Risk increasing";
      case 'decreasing':
        return "Risk decreasing";
      case 'stable':
      default:
        return "Risk stable";
    }
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            {formatCategory(prediction.category)} Risk Analysis
          </CardTitle>
          {prediction.isCritical && (
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
              Critical Risk
            </span>
          )}
        </div>
        <CardDescription>
          AI-powered risk prediction
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Risk Score</span>
            <span className="font-medium">{Math.round(prediction.riskScore)}/100</span>
          </div>
          <Progress 
            value={prediction.riskScore} 
            className="h-2" 
            indicatorClassName={getRiskColor(prediction.riskScore)} 
          />
          
          <div className="flex justify-between text-xs">
            <span className="text-green-600">Low Risk</span>
            <span className="text-amber-600">Medium Risk</span>
            <span className="text-red-600">High Risk</span>
          </div>
          
          <div className="flex items-center justify-between text-sm pt-2">
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span>{getTrendText()}</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center cursor-help">
                    <span className="text-muted-foreground">
                      {Math.round(prediction.confidenceLevel * 100)}% confidence
                    </span>
                    <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    This prediction's confidence level is based on the quality and quantity of data analyzed.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="text-sm">
          <p className="font-medium mb-2">Key Risk Factors:</p>
          <div className="space-y-3">
            {prediction.factors.map((factor, index) => (
              <div key={index} className="bg-muted/40 rounded-md p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{factor.name}</span>
                  <span className={`text-xs ${
                    factor.impact > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {factor.impact > 0 ? '+' : ''}{Math.round(factor.impact * 100)}% impact
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{factor.recommendation || ''}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-2 text-xs text-muted-foreground border-t flex justify-between">
          <span>Updated: {formatDate(prediction.date)}</span>
          <span>Category: {formatCategory(prediction.category)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskPredictionCard;
