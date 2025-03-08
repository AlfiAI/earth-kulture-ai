
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { benchmarkingService, ESGBenchmarkingResult } from '@/services/benchmarking';
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2, ArrowRightLeft, TrendingUp, TrendingDown, Info } from 'lucide-react';

const IndustryComparisonCard = () => {
  const [benchmarkData, setBenchmarkData] = useState<ESGBenchmarkingResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await benchmarkingService.getIndustryBenchmarks("Technology");
        setBenchmarkData(data);
      } catch (error) {
        console.error("Error loading benchmark data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <BarChart2 className="mr-2 h-5 w-5 text-primary" />
          Industry ESG Comparison
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : benchmarkData ? (
          <div className="space-y-6">
            <div className="p-4 bg-muted/30 rounded-md flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Your ESG Score</span>
                <span className="text-3xl font-bold">{benchmarkData.yourScore}</span>
              </div>

              <ArrowRightLeft className="h-5 w-5 mx-4 text-muted-foreground" />

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Industry Average</span>
                <span className="text-3xl font-bold">{benchmarkData.industryAverage}</span>
              </div>

              <div className="flex flex-col ml-6 pl-6 border-l">
                <span className="text-sm text-muted-foreground">Percentile</span>
                <span className="text-3xl font-bold">{benchmarkData.percentile}<sup>th</sup></span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-4">ESG Score Trends</h4>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={benchmarkData.trends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="period" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => [`${value}`, 'Score']}
                      labelFormatter={(label) => `Period: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="yourScore" name="Your Score" fill="#3b82f6" />
                    <Bar dataKey="industryAvg" name="Industry Avg" fill="#d1d5db" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Improvement Areas</h4>
              <div className="space-y-3">
                {benchmarkData.improvementAreas.map((area, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 bg-muted/30 rounded-md flex justify-between items-start"
                  >
                    <div>
                      <div className="font-medium text-sm">{area.area}</div>
                      <div className="text-xs text-muted-foreground mt-1">{area.recommendation}</div>
                    </div>
                    <div className="flex items-center bg-primary/10 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap">
                      <TrendingUp className="h-3.5 w-3.5 mr-1 text-primary" />
                      +{area.potentialImprovement} points
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t text-xs text-muted-foreground flex justify-between">
              <div className="flex items-center">
                <Info className="h-3.5 w-3.5 mr-1" />
                AI-powered analysis based on industry benchmarks
              </div>
              <span>Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load benchmark data
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndustryComparisonCard;
