import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ESGPrediction, benchmarkingService } from '@/services/benchmarking';

const PredictiveInsights = () => {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<ESGPrediction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'esg' | 'carbon' | 'compliance' | 'financial'>('esg');
  
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const data = await benchmarkingService.getPredictions(selectedCategory);
        setPredictions(data);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPredictions();
  }, [selectedCategory]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const formatValue = (category: string, value: number): string => {
    switch (category) {
      case 'esg':
        return `${value}/100`;
      case 'carbon':
        return `${value} tCO2e`;
      case 'compliance':
        return `${value}%`;
      case 'financial':
        return `$${value.toLocaleString()}`;
      default:
        return value.toString();
    }
  };

  const getPredictionColor = (category: string, trend: 'up' | 'down' | 'stable'): string => {
    if (category === 'esg' || category === 'compliance') {
      return trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
    } else if (category === 'carbon') {
      return trend === 'down' ? 'text-green-500' : trend === 'up' ? 'text-red-500' : 'text-gray-500';
    } else {
      return trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Predictive Analytics
        </CardTitle>
        <CardDescription>
          AI-powered forecasts and trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="esg" value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="esg">ESG Score</TabsTrigger>
            <TabsTrigger value="carbon">Carbon</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedCategory}>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : predictions.length > 0 ? (
              <div className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div key={index} className="bg-muted/40 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(prediction.trendDirection)}
                        <span className="font-medium">
                          Predicted {prediction.category === 'esg' ? 'ESG Score' : 
                                    prediction.category === 'carbon' ? 'Carbon Emissions' :
                                    prediction.category === 'compliance' ? 'Compliance Score' : 
                                    'Financial Impact'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(prediction.predictedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Current</p>
                        <p className="text-xl font-semibold">
                          {formatValue(prediction.category, prediction.currentValue)}
                        </p>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Predicted</p>
                        <p className={`text-xl font-semibold ${getPredictionColor(prediction.category, prediction.trendDirection)}`}>
                          {formatValue(prediction.category, prediction.predictedValue)}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Key Factors:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {prediction.factors.map((factor, fidx) => (
                          <div key={fidx} className="flex items-center justify-between">
                            <span className="text-sm">{factor.name}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              factor.impact > 0 ? 'bg-green-100 text-green-800' : 
                                                'bg-red-100 text-red-800'
                            }`}>
                              {factor.impact > 0 ? '+' : ''}{Math.round(factor.impact * 100)}% impact
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-2 border-t text-sm">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="ml-2 font-medium">{Math.round(prediction.confidence * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground p-4">
                No predictions available for this category
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PredictiveInsights;
