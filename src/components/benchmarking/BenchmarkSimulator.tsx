
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimulationAdjustment, PredictionCategory, ESGPrediction, benchmarkingService } from '@/services/benchmarking';
import { ArrowRight, Beaker, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const BenchmarkSimulator = () => {
  const [activeCategory, setActiveCategory] = useState<PredictionCategory>('esg');
  const [isLoading, setIsLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState<ESGPrediction | null>(null);
  
  // Default adjustment settings
  const [adjustments, setAdjustments] = useState<Record<PredictionCategory, SimulationAdjustment[]>>({
    esg: [
      { metricName: "Renewable Energy Usage", value: 30, originalValue: 30 },
      { metricName: "Waste Reduction", value: 40, originalValue: 40 },
      { metricName: "Diversity Score", value: 65, originalValue: 65 },
      { metricName: "Supply Chain Sustainability", value: 55, originalValue: 55 }
    ],
    carbon: [
      { metricName: "Direct Emissions (Scope 1)", value: 120, originalValue: 120 },
      { metricName: "Indirect Emissions (Scope 2)", value: 85, originalValue: 85 },
      { metricName: "Business Travel", value: 45, originalValue: 45 }
    ],
    compliance: [
      { metricName: "Reporting Completeness", value: 85, originalValue: 85 },
      { metricName: "Policy Implementation", value: 75, originalValue: 75 },
      { metricName: "Audit Success Rate", value: 90, originalValue: 90 }
    ],
    financial: [
      { metricName: "ESG Investment", value: 250000, originalValue: 250000 },
      { metricName: "Operational Efficiency", value: 72, originalValue: 72 },
      { metricName: "Green Revenue Percentage", value: 18, originalValue: 18 }
    ]
  });
  
  const handleSliderChange = (category: PredictionCategory, index: number, newValue: number) => {
    const updatedAdjustments = { ...adjustments };
    updatedAdjustments[category][index].value = newValue;
    setAdjustments(updatedAdjustments);
  };
  
  const handleReset = () => {
    const resetAdjustments = { ...adjustments };
    resetAdjustments[activeCategory].forEach(adjustment => {
      adjustment.value = adjustment.originalValue;
    });
    setAdjustments(resetAdjustments);
    setSimulationResult(null);
  };
  
  const handleSimulate = async () => {
    setIsLoading(true);
    try {
      const result = await benchmarkingService.runSimulation(
        activeCategory,
        adjustments[activeCategory]
      );
      setSimulationResult(result);
      toast.success("Simulation completed");
    } catch (error) {
      console.error("Simulation error:", error);
      toast.error("Failed to run simulation");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };
  
  const formatValue = (category: PredictionCategory, value: number) => {
    switch (category) {
      case 'esg':
        return value.toString();
      case 'carbon':
        return `${value} tCO2e`;
      case 'compliance':
        return `${value}%`;
      case 'financial':
        return `$${value.toLocaleString()}`;
    }
  };
  
  const getSliderStep = (category: PredictionCategory, adjustment: SimulationAdjustment) => {
    if (category === 'financial' && adjustment.metricName.includes('Investment')) return 10000;
    if (category === 'carbon') return 5;
    return 1;
  };
  
  const getSliderMax = (category: PredictionCategory, adjustment: SimulationAdjustment) => {
    if (category === 'financial' && adjustment.metricName.includes('Investment')) return 1000000;
    if (category === 'financial' && adjustment.metricName.includes('Percentage')) return 100;
    if (category === 'carbon') return 200;
    if (category === 'compliance' || adjustment.metricName.includes('Percentage')) return 100;
    return 100;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Beaker className="mr-2 h-5 w-5 text-primary" />
          ESG What-If Simulator
        </CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="esg" value={activeCategory} onValueChange={(value) => {
        setActiveCategory(value as PredictionCategory);
        setSimulationResult(null);
      }}>
        <div className="px-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="esg">ESG</TabsTrigger>
            <TabsTrigger value="carbon">Carbon</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                {adjustments[activeCategory].map((adjustment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">
                        {adjustment.metricName}
                      </label>
                      <span className="text-sm">
                        {formatValue(activeCategory, adjustment.value)}
                      </span>
                    </div>
                    <Slider
                      value={[adjustment.value]}
                      min={0}
                      max={getSliderMax(activeCategory, adjustment)}
                      step={getSliderStep(activeCategory, adjustment)}
                      onValueChange={(vals) => handleSliderChange(activeCategory, index, vals[0])}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSimulate} disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    <>Run Simulation</>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                  Reset
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-muted/20">
              <h3 className="font-medium mb-4">Simulation Results</h3>
              
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : simulationResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Current</p>
                      <p className="text-xl font-semibold">
                        {formatValue(activeCategory, simulationResult.currentValue)}
                      </p>
                    </div>
                    
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Predicted</p>
                      <p className="text-xl font-semibold flex items-center justify-center">
                        {formatValue(activeCategory, simulationResult.predictedValue)}
                        <span className="ml-2">{getTrendIcon(simulationResult.trendDirection)}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Impact Factors:</p>
                    <div className="space-y-2">
                      {simulationResult.factors.map((factor, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm p-2 bg-muted/20 rounded">
                          <span>{factor.name}</span>
                          <span className={`${factor.impact > 0 ? 'text-green-600' : factor.impact < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                            {factor.impact > 0 ? '+' : ''}{Math.round(factor.impact * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">AI Recommendation:</p>
                    {activeCategory === 'esg' && (
                      <p>Focus on improving your renewable energy usage and supply chain sustainability for the greatest impact on your overall ESG score.</p>
                    )}
                    {activeCategory === 'carbon' && (
                      <p>Reducing Scope 1 emissions will provide the most significant impact on your carbon footprint. Consider energy efficiency measures and renewable energy sources.</p>
                    )}
                    {activeCategory === 'compliance' && (
                      <p>Enhancing policy implementation will improve your overall compliance score more effectively than other measures.</p>
                    )}
                    {activeCategory === 'financial' && (
                      <p>Increasing your green revenue percentage would yield the highest financial return relative to investment.</p>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Confidence: {Math.round(simulationResult.confidence * 100)}%
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <p className="text-muted-foreground">
                    Adjust the parameters and run the simulation to see the predicted impact on your ESG performance.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default BenchmarkSimulator;
