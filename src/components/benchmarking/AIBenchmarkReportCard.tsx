
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ArrowDownToLine, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import { aiBenchmarkingService, AIBenchmarkResult } from '@/services/benchmarking/aiBenchmarkingService';
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const AIBenchmarkReportCard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<AIBenchmarkResult | null>(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const result = await aiBenchmarkingService.runBenchmark({
        category: "environmental",
        industry: "technology",
        metrics: [
          { name: "Carbon Emissions", value: 120 },
          { name: "Energy Efficiency", value: 72 },
          { name: "Water Usage", value: 65 }
        ]
      });
      
      if (result) {
        setBenchmarkResult(result);
        toast.success("AI benchmark analysis completed");
      }
    } catch (error) {
      console.error("Error generating benchmark report:", error);
      toast.error("Failed to generate benchmark report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          AI-Generated ESG Benchmark Report
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {benchmarkResult ? (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-0">
              <div className="p-4 bg-muted/30 rounded-md flex flex-col sm:flex-row items-center justify-around gap-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Your Score</div>
                  <div className="text-3xl font-bold">{benchmarkResult.score}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Industry Avg</div>
                  <div className="text-3xl font-bold">{benchmarkResult.industryAverage}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Percentile</div>
                  <div className="text-3xl font-bold">{benchmarkResult.percentile}<sup>th</sup></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  {benchmarkResult.trend === 'improving' && (
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  )}
                  {benchmarkResult.trend === 'declining' && (
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                  )}
                  <h4 className="font-medium">Performance Trend</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your ESG performance is {benchmarkResult.trend}. 
                  {benchmarkResult.trend === 'improving' ? 
                    ' Continue implementing your current strategies while focusing on the recommended improvement areas.' : 
                    ' Take immediate action on the recommended areas to improve your score.'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                  <h4 className="font-medium">Key Insight</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {benchmarkResult.score > benchmarkResult.industryAverage ?
                    `You're performing ${Math.round((benchmarkResult.score / benchmarkResult.industryAverage - 1) * 100)}% better than the industry average in ${benchmarkResult.category}.` :
                    `You're performing ${Math.round((1 - benchmarkResult.score / benchmarkResult.industryAverage) * 100)}% below the industry average in ${benchmarkResult.category}.`}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              <div className="space-y-4">
                <h4 className="text-sm font-medium mb-2">Comparison Details</h4>
                <div className="space-y-2">
                  {benchmarkResult.comparisonDetails.map((detail, idx) => (
                    <div key={idx} className="p-3 bg-muted/30 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{detail.metricName}</span>
                        <span className={detail.difference > 0 ? "text-green-600" : "text-red-600"}>
                          {detail.difference > 0 ? "+" : ""}{detail.difference}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Your value: {detail.yourValue}</span>
                        <span>Industry avg: {detail.industryAvg}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-0">
              <div className="space-y-4">
                <h4 className="text-sm font-medium mb-2">AI Recommendations</h4>
                <div className="space-y-3">
                  {benchmarkResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 bg-muted/30 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{rec.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          rec.impact === 'high' ? 'bg-red-100 text-red-800' :
                          rec.impact === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {rec.impact} impact
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <div className="mt-4 pt-4 border-t flex justify-between">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setBenchmarkResult(null)}>
                Generate New Report
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <ArrowDownToLine className="h-3.5 w-3.5 mr-1.5" />
                Export PDF
              </Button>
            </div>
          </Tabs>
        ) : (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <Sparkles className="h-12 w-12 mx-auto text-primary/60" />
              <h3 className="font-medium">AI-Powered ESG Benchmark Analysis</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Generate a comprehensive AI analysis of your ESG performance compared to industry benchmarks, with tailored recommendations.
              </p>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <Button 
                onClick={handleGenerateReport} 
                className="w-full"
              >
                Generate Benchmark Report
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIBenchmarkReportCard;
