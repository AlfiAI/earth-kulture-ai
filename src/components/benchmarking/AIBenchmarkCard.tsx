
import { TrendingUp, ArrowRight, Lightbulb, ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AIBenchmarkResult } from "@/services/benchmarking/aiBenchmarkingService";

interface AIBenchmarkCardProps {
  benchmark: AIBenchmarkResult;
  className?: string;
}

const AIBenchmarkCard = ({ benchmark, className }: AIBenchmarkCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getPerformanceColor = (score: number, industryAvg: number) => {
    const difference = score - industryAvg;
    
    if (benchmark.category === 'environmental') {
      // For environmental metrics, lower is better
      return difference < 0 ? 'text-green-600' : 'text-red-600';
    } else {
      // For other categories, higher is better
      return difference > 0 ? 'text-green-600' : 'text-red-600';
    }
  };

  const getPerformanceText = (score: number, industryAvg: number) => {
    const difference = score - industryAvg;
    const percentDiff = Math.abs((difference / industryAvg) * 100).toFixed(1);
    
    if (benchmark.category === 'environmental') {
      // For environmental metrics, lower is better
      return difference < 0 
        ? `${percentDiff}% below average (better)` 
        : `${percentDiff}% above average (worse)`;
    } else {
      // For other categories, higher is better
      return difference > 0 
        ? `${percentDiff}% above average (better)` 
        : `${percentDiff}% below average (worse)`;
    }
  };

  const getTrendIcon = () => {
    switch (benchmark.trend) {
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
    switch (benchmark.trend) {
      case 'improving':
        return "Improving trend";
      case 'declining':
        return "Declining trend";
      case 'stable':
      default:
        return "Stable trend";
    }
  };

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {formatCategory(benchmark.category)} Benchmark
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Your Score</div>
            <div className="text-3xl font-bold">{Math.round(benchmark.score)}</div>
          </div>
          
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Industry Avg</div>
            <div className="text-3xl font-bold">{Math.round(benchmark.industryAverage)}</div>
          </div>
          
          {benchmark.percentile && (
            <div className="flex flex-col items-center border-l pl-4">
              <div className="text-sm text-muted-foreground mb-1">Percentile</div>
              <div className="text-xl font-bold">{benchmark.percentile}<sup>th</sup></div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Performance Score</span>
            <span className={getPerformanceColor(benchmark.score, benchmark.industryAverage)}>
              {getPerformanceText(benchmark.score, benchmark.industryAverage)}
            </span>
          </div>
          
          <Progress 
            value={benchmark.score} 
            max={Math.max(benchmark.score, benchmark.industryAverage) * 1.2}
            className="h-3"
          />
          
          <div className="flex justify-between text-xs">
            <span>0</span>
            <span className="font-medium">Industry Avg: {Math.round(benchmark.industryAverage)}</span>
            <span>{Math.round(Math.max(benchmark.score, benchmark.industryAverage) * 1.2)}</span>
          </div>
        </div>
        
        {benchmark.comparisonDetails.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Metric Comparison</h4>
            <div className="space-y-2 text-sm">
              {benchmark.comparisonDetails.slice(0, 3).map((detail, index) => (
                <div key={index} className="bg-muted/40 p-2 rounded-md flex justify-between items-center">
                  <div>
                    <div className="font-medium">{detail.metricName}</div>
                    <div className="text-xs flex items-center">
                      <span>You: <strong>{detail.yourValue}</strong></span>
                      <span className="mx-1">|</span>
                      <span>Avg: <strong>{detail.industryAvg}</strong></span>
                    </div>
                  </div>
                  <div className={
                    detail.difference > 0 
                      ? benchmark.category === 'environmental' ? 'text-red-600' : 'text-green-600'
                      : benchmark.category === 'environmental' ? 'text-green-600' : 'text-red-600'
                  }>
                    {detail.difference > 0 ? '+' : ''}{detail.difference.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {benchmark.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
              AI Recommendations
            </h4>
            <div className="space-y-2">
              {benchmark.recommendations.map((rec, index) => (
                <div key={index} className="bg-muted/40 p-2 rounded-md">
                  <div className="flex justify-between mb-1">
                    <div className="font-medium text-sm">{rec.title}</div>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${getImpactColor(rec.impact)}`}>
                      {rec.impact} impact
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground border-t pt-2 flex justify-between">
        <div className="flex items-center">
          {getTrendIcon()}
          <span className="ml-1">{getTrendText()}</span>
        </div>
        <span>Generated: {formatDate(benchmark.date)}</span>
      </CardFooter>
    </Card>
  );
};

export default AIBenchmarkCard;
