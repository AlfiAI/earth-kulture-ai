
import { useState, useEffect } from 'react';
import { Dices, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { benchmarkingService } from '@/services/benchmarkingService';
import { esgDataService } from '@/services/esgDataService';

const IndustryComparison = () => {
  const [loading, setLoading] = useState(true);
  const [comparison, setComparison] = useState<{
    overallPercentile: number;
    environmentalPercentile: number;
    socialPercentile: number;
    governancePercentile: number;
  } | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const esgScore = await esgDataService.calculateESGScore(
          await esgDataService.getAllESGData(),
          await esgDataService.getCarbonEmissions(),
          await esgDataService.getComplianceFrameworks()
        );
        
        const comparisonData = await benchmarkingService.compareToIndustry(esgScore);
        setComparison({
          overallPercentile: comparisonData.overallPercentile,
          environmentalPercentile: comparisonData.environmentalPercentile,
          socialPercentile: comparisonData.socialPercentile,
          governancePercentile: comparisonData.governancePercentile,
        });
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return "bg-green-500";
    if (percentile >= 60) return "bg-blue-500";
    if (percentile >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Industry Benchmarking
        </CardTitle>
        <CardDescription>
          Your performance compared to industry peers
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Dices className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : comparison ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm font-medium">Overall ESG Score</p>
                <p className="text-sm font-medium">{comparison.overallPercentile}th percentile</p>
              </div>
              <Progress 
                value={comparison.overallPercentile} 
                className="h-2" 
                indicatorClassName={getPercentileColor(comparison.overallPercentile)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-xs">Environmental</p>
                  <p className="text-xs">{comparison.environmentalPercentile}%</p>
                </div>
                <Progress 
                  value={comparison.environmentalPercentile} 
                  className="h-1.5" 
                  indicatorClassName={getPercentileColor(comparison.environmentalPercentile)}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-xs">Social</p>
                  <p className="text-xs">{comparison.socialPercentile}%</p>
                </div>
                <Progress 
                  value={comparison.socialPercentile} 
                  className="h-1.5" 
                  indicatorClassName={getPercentileColor(comparison.socialPercentile)}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-xs">Governance</p>
                  <p className="text-xs">{comparison.governancePercentile}%</p>
                </div>
                <Progress 
                  value={comparison.governancePercentile} 
                  className="h-1.5" 
                  indicatorClassName={getPercentileColor(comparison.governancePercentile)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm pt-2 mt-2 border-t">
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Top 20% in energy efficiency</span>
              </div>
              <span className="text-xs text-muted-foreground">Tech industry</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-4">
            Unable to load benchmark data
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndustryComparison;
