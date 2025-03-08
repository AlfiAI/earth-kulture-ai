
import { useState, useEffect } from "react";
import { Lightbulb, AlertTriangle, Loader2, TrendingUp, BarChart, BarChart2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RiskPredictionCard from "@/components/ai/RiskPredictionCard";
import ComplianceAlertCard from "@/components/compliance/ComplianceAlertCard";
import AIBenchmarkCard from "@/components/benchmarking/AIBenchmarkCard";
import PredictionAccuracyTesting from "@/components/ai/PredictionAccuracyTesting";
import { riskPredictionService, RiskPrediction } from "@/services/ai/riskPredictionService";
import { complianceAlertService, ComplianceAlert } from "@/services/compliance/alertService";
import { aiBenchmarkingService, AIBenchmarkResult } from "@/services/benchmarking/aiBenchmarkingService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function AIInsights() {
  const [activeTab, setActiveTab] = useState("risks");
  const [isLoading, setIsLoading] = useState(true);
  const [riskPredictions, setRiskPredictions] = useState<RiskPrediction[]>([]);
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([]);
  const [benchmarkResults, setBenchmarkResults] = useState<AIBenchmarkResult[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const predictions = await riskPredictionService.getUserPredictions();
      const alerts = await complianceAlertService.getAlerts();
      const benchmarks = await aiBenchmarkingService.getBenchmarkResults();
      
      setRiskPredictions(predictions);
      setComplianceAlerts(alerts);
      setBenchmarkResults(benchmarks);
    } catch (error) {
      console.error("Error fetching AI insights data:", error);
      toast.error("Failed to load AI insights");
    } finally {
      setIsLoading(false);
    }
  };

  const runDemoRiskAnalysis = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const userData = await supabase.auth.getUser();
      const demoRequest = {
        userId: userData.data.user?.id || 'test-user',
        category: 'carbon',
        dataPoints: [
          { metric: 'Scope 1 Emissions', value: 120, date: '2023-01-01' },
          { metric: 'Scope 1 Emissions', value: 110, date: '2023-02-01' },
          { metric: 'Scope 1 Emissions', value: 105, date: '2023-03-01' },
          { metric: 'Scope 2 Emissions', value: 80, date: '2023-01-01' },
          { metric: 'Scope 2 Emissions', value: 85, date: '2023-02-01' },
          { metric: 'Scope 2 Emissions', value: 90, date: '2023-03-01' },
        ],
        complianceFrameworks: ['GHG Protocol', 'TCFD'],
        industryBenchmarks: {
          'Scope 1 Emissions': 100,
          'Scope 2 Emissions': 75,
        }
      };
      
      const prediction = await riskPredictionService.generatePrediction(demoRequest);
      if (prediction) {
        fetchData(); // Refresh all data
        toast.success("Risk analysis completed");
      }
    } catch (error) {
      console.error("Error running demo risk analysis:", error);
      toast.error("Failed to run risk analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const runDemoBenchmark = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const demoBenchmarkRequest = {
        category: 'environmental',
        industry: 'technology',
        metrics: [
          { name: 'Carbon Emissions', value: 85 },
          { name: 'Water Usage', value: 0.8 },
          { name: 'Waste Recycling', value: 78 },
        ]
      };
      
      const result = await aiBenchmarkingService.runBenchmark(demoBenchmarkRequest);
      if (result) {
        fetchData(); // Refresh all data
        toast.success("Benchmark analysis completed");
      }
    } catch (error) {
      console.error("Error running demo benchmark:", error);
      toast.error("Failed to run benchmark analysis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI-Driven ESG Insights</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runDemoRiskAnalysis} 
              disabled={isLoading}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Run Risk Analysis
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runDemoBenchmark}
              disabled={isLoading}
            >
              <BarChart className="mr-2 h-4 w-4" />
              Run Benchmark
            </Button>
            <Button 
              size="sm" 
              onClick={fetchData}
              disabled={isLoading}
            >
              Refresh Data
            </Button>
          </div>
        </div>
        
        <Card className="bg-gradient-to-r from-primary/10 to-muted border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">AI-Powered ESG Risk Management</h2>
                <p className="text-muted-foreground mb-3">
                  This system uses machine learning to analyze your ESG data, predict compliance risks, 
                  and benchmark your performance against industry standards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Prediction Accuracy Testing Component */}
        <PredictionAccuracyTesting />
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="risks" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="risks">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Risk Predictions
              </TabsTrigger>
              <TabsTrigger value="alerts">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Compliance Alerts
              </TabsTrigger>
              <TabsTrigger value="benchmarks">
                <TrendingUp className="mr-2 h-4 w-4" />
                AI Benchmarking
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="risks" className="mt-6">
              {riskPredictions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {riskPredictions.map((prediction) => (
                    <RiskPredictionCard key={prediction.id} prediction={prediction} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Risk Predictions Yet</CardTitle>
                    <CardDescription>
                      Run a risk analysis to generate predictions for your ESG performance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={runDemoRiskAnalysis}>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Run Demo Risk Analysis
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="alerts" className="mt-6">
              {complianceAlerts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {complianceAlerts.map((alert) => (
                    <ComplianceAlertCard 
                      key={alert.id} 
                      alert={alert} 
                      onStatusChange={fetchData} 
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Compliance Alerts</CardTitle>
                    <CardDescription>
                      No alerts have been detected in your ESG data yet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Alerts are automatically generated when your data shows potential compliance issues.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="benchmarks" className="mt-6">
              {benchmarkResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benchmarkResults.map((benchmark) => (
                    <AIBenchmarkCard key={benchmark.id} benchmark={benchmark} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Benchmark Results Yet</CardTitle>
                    <CardDescription>
                      Run a benchmark analysis to compare your performance against industry standards.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={runDemoBenchmark}>
                      <BarChart className="mr-2 h-4 w-4" />
                      Run Demo Benchmark
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};
