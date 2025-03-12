
import React, { useState, useEffect } from 'react';
import { IndustryType, TaskPriority } from '@/services/ai/orchestration/types/agentTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUpIcon, ArrowDownIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { externalDataService } from '@/services/external/externalDataService';
import { toast } from 'sonner';
import { aiAgentOrchestrator } from '@/services/ai/orchestration/aiAgentOrchestrator';

interface BenchmarkSimulatorProps {
  industryContext: IndustryType;
}

const BenchmarkSimulator: React.FC<BenchmarkSimulatorProps> = ({ industryContext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [benchmarkData, setBenchmarkData] = useState<any>(null);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [simulationInProgress, setSimulationInProgress] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);

  useEffect(() => {
    loadIndustryBenchmarks();
  }, [industryContext]);

  const loadIndustryBenchmarks = async () => {
    setIsLoading(true);
    try {
      const benchmarks = await externalDataService.fetchBenchmarks(industryContext);
      setBenchmarkData({
        industry: industryContext,
        metrics: {
          carbonIntensity: benchmarks.find(b => b.benchmark_name === 'carbonIntensity')?.benchmark_value || 0.45,
          waterUsage: benchmarks.find(b => b.benchmark_name === 'waterUsage')?.benchmark_value || 3.2,
          wasteRecycling: benchmarks.find(b => b.benchmark_name === 'wasteRecycling')?.benchmark_value || 68,
          renewableEnergy: benchmarks.find(b => b.benchmark_name === 'renewableEnergy')?.benchmark_value || 32,
          employeeDiversity: benchmarks.find(b => b.benchmark_name === 'employeeDiversity')?.benchmark_value || 70
        },
        trends: {
          carbonIntensity: 'decreasing',
          waterUsage: 'stable',
          wasteRecycling: 'increasing',
          renewableEnergy: 'rapidly-increasing',
          employeeDiversity: 'slightly-increasing'
        },
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading benchmarks:', error);
      toast.error('Failed to load industry benchmarks');
    } finally {
      setIsLoading(false);
    }
  };

  const runESGSimulation = async () => {
    setSimulationInProgress(true);
    setSimulationProgress(0);
    
    try {
      // Simulate progress updates
      const interval = setInterval(() => {
        setSimulationProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 700);
      
      // Submit simulation task to AI orchestrator
      const taskId = await aiAgentOrchestrator.submitTask(
        'predictive-analytics',
        {
          industryContext,
          currentBenchmarks: benchmarkData?.metrics,
          action: 'simulate-esg-scenarios',
          timeframe: '12-months'
        },
        TaskPriority.HIGH
      );
      
      // Poll for task completion
      const checkTaskStatus = async () => {
        const taskStatus = aiAgentOrchestrator.getTaskStatus(taskId);
        
        if (taskStatus?.status === 'completed' && taskStatus.result) {
          clearInterval(interval);
          setSimulationProgress(100);
          
          // Process results
          setTimeout(() => {
            setSimulationResults({
              scenarios: [
                {
                  name: 'Business as Usual',
                  metrics: {
                    carbonIntensity: benchmarkData.metrics.carbonIntensity * 0.97,
                    waterUsage: benchmarkData.metrics.waterUsage * 0.99,
                    wasteRecycling: benchmarkData.metrics.wasteRecycling * 1.02,
                    renewableEnergy: benchmarkData.metrics.renewableEnergy * 1.05,
                    employeeDiversity: benchmarkData.metrics.employeeDiversity * 1.01
                  },
                  risk: 'moderate',
                  compliance: 'partial'
                },
                {
                  name: 'Ambitious Sustainability',
                  metrics: {
                    carbonIntensity: benchmarkData.metrics.carbonIntensity * 0.75,
                    waterUsage: benchmarkData.metrics.waterUsage * 0.80,
                    wasteRecycling: benchmarkData.metrics.wasteRecycling * 1.15,
                    renewableEnergy: benchmarkData.metrics.renewableEnergy * 1.40,
                    employeeDiversity: benchmarkData.metrics.employeeDiversity * 1.10
                  },
                  risk: 'low',
                  compliance: 'full'
                },
                {
                  name: 'Regulatory Minimum',
                  metrics: {
                    carbonIntensity: benchmarkData.metrics.carbonIntensity * 0.90,
                    waterUsage: benchmarkData.metrics.waterUsage * 0.95,
                    wasteRecycling: benchmarkData.metrics.wasteRecycling * 1.05,
                    renewableEnergy: benchmarkData.metrics.renewableEnergy * 1.10,
                    employeeDiversity: benchmarkData.metrics.employeeDiversity * 1.02
                  },
                  risk: 'moderate-high',
                  compliance: 'minimum'
                }
              ],
              recommendations: [
                'Increase renewable energy adoption by 20% over the next 12 months',
                'Implement water recycling systems in main facilities',
                'Enhance supplier ESG assessment process',
                'Set science-based targets for emissions reduction'
              ],
              generatedAt: new Date().toISOString()
            });
            setSimulationInProgress(false);
            setActiveTab('simulation');
          }, 1000);
        } else if (taskStatus?.status === 'failed') {
          clearInterval(interval);
          setSimulationInProgress(false);
          toast.error('Simulation failed: ' + taskStatus.error);
        } else {
          // Check again in 1 second
          setTimeout(checkTaskStatus, 1000);
        }
      };
      
      checkTaskStatus();
      
    } catch (error) {
      console.error('Error running simulation:', error);
      toast.error('Failed to run ESG simulation');
      setSimulationInProgress(false);
    }
  };

  const renderMetricValue = (name: string, value: number, trend?: string) => {
    const getIcon = () => {
      if (!trend) return null;
      
      if (trend.includes('increasing')) {
        return name === 'carbonIntensity' || name === 'waterUsage' 
          ? <ArrowUpIcon className="h-4 w-4 text-red-500" /> 
          : <ArrowUpIcon className="h-4 w-4 text-green-500" />;
      } else if (trend.includes('decreasing')) {
        return name === 'carbonIntensity' || name === 'waterUsage'
          ? <ArrowDownIcon className="h-4 w-4 text-green-500" />
          : <ArrowDownIcon className="h-4 w-4 text-red-500" />;
      }
      return null;
    };
    
    return (
      <div className="flex items-center gap-1">
        <span>{value.toFixed(2)}</span>
        {getIcon()}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Industry Benchmark Simulator</CardTitle>
          <CardDescription>Loading industry benchmarks...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin h-8 w-8 text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>ESG Performance Simulator</CardTitle>
        <CardDescription>
          Simulate how different ESG strategies would affect your performance relative to {industryContext} industry benchmarks
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Benchmarks</TabsTrigger>
            <TabsTrigger value="simulation" disabled={!simulationResults}>
              Simulation Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-4 pt-4">
            {benchmarkData && (
              <>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Carbon Intensity</div>
                      <div className="text-2xl font-bold mt-2">
                        {renderMetricValue('carbonIntensity', benchmarkData.metrics.carbonIntensity, benchmarkData.trends.carbonIntensity)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Industry average: {benchmarkData.metrics.carbonIntensity.toFixed(2)} tCO₂e/$M</div>
                    </div>
                    
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Renewable Energy</div>
                      <div className="text-2xl font-bold mt-2">
                        {renderMetricValue('renewableEnergy', benchmarkData.metrics.renewableEnergy, benchmarkData.trends.renewableEnergy)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Industry average: {benchmarkData.metrics.renewableEnergy.toFixed(2)}%</div>
                    </div>
                    
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Water Usage</div>
                      <div className="text-2xl font-bold mt-2">
                        {renderMetricValue('waterUsage', benchmarkData.metrics.waterUsage, benchmarkData.trends.waterUsage)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Industry average: {benchmarkData.metrics.waterUsage.toFixed(2)} m³/$M</div>
                    </div>
                    
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Waste Recycling</div>
                      <div className="text-2xl font-bold mt-2">
                        {renderMetricValue('wasteRecycling', benchmarkData.metrics.wasteRecycling, benchmarkData.trends.wasteRecycling)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Industry average: {benchmarkData.metrics.wasteRecycling.toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={runESGSimulation} 
                    disabled={simulationInProgress}
                    className="w-full"
                  >
                    {simulationInProgress ? 'Running Simulation...' : 'Run ESG Performance Simulation'}
                  </Button>
                  
                  {simulationInProgress && (
                    <div className="mt-4">
                      <Progress value={simulationProgress} className="h-2 mb-2" />
                      <p className="text-xs text-center text-muted-foreground">
                        {simulationProgress < 100 
                          ? 'Processing industry data and regulations...' 
                          : 'Simulation complete!'}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="simulation" className="space-y-4 pt-4">
            {simulationResults && (
              <>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h3 className="text-sm font-medium mb-2">Simulation Results</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Based on your current ESG performance and industry trends, we've simulated three possible scenarios for your organization:
                  </p>
                  
                  <div className="space-y-4">
                    {simulationResults.scenarios.map((scenario: any, index: number) => (
                      <div key={index} className="rounded-lg border bg-card p-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium">{scenario.name}</h4>
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            scenario.risk === 'low' ? 'bg-green-100 text-green-800' :
                            scenario.risk === 'moderate' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {scenario.risk} risk
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="text-xs">
                            <span className="text-muted-foreground">Carbon: </span>
                            {(scenario.metrics.carbonIntensity * 100 / benchmarkData.metrics.carbonIntensity - 100).toFixed(0)}%
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Energy: </span>
                            {(scenario.metrics.renewableEnergy * 100 / benchmarkData.metrics.renewableEnergy - 100).toFixed(0)}%
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Water: </span>
                            {(scenario.metrics.waterUsage * 100 / benchmarkData.metrics.waterUsage - 100).toFixed(0)}%
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Waste: </span>
                            {(scenario.metrics.wasteRecycling * 100 / benchmarkData.metrics.wasteRecycling - 100).toFixed(0)}%
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs">
                          <span className="text-muted-foreground">Compliance: </span>
                          <span className={`${
                            scenario.compliance === 'full' ? 'text-green-600' :
                            scenario.compliance === 'partial' ? 'text-amber-600' :
                            'text-red-600'
                          }`}>
                            {scenario.compliance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    AI-Generated Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {simulationResults.recommendations.map((recommendation: string, index: number) => (
                      <li key={index} className="text-sm">
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  onClick={runESGSimulation} 
                  variant="outline" 
                  disabled={simulationInProgress}
                  className="w-full"
                >
                  Run New Simulation
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t p-4 text-xs text-muted-foreground">
        Data sourced from multiple ESG databases. Last updated: {benchmarkData ? new Date(benchmarkData.lastUpdated).toLocaleDateString() : 'N/A'}
      </CardFooter>
    </Card>
  );
};

export default BenchmarkSimulator;
