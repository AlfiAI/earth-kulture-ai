
import { useState } from 'react';
import { Button } from "@/components/ui/card";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, BarChart2, AlertTriangle, Check, RefreshCw } from "lucide-react";
import { PredictionAccuracyResult, AnomalyDetectionResult, predictionTestingService } from '@/services/ai/predictionTesting';

const PredictionAccuracyTesting = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResults, setPredictionResults] = useState<PredictionAccuracyResult[]>([]);
  const [anomalyResults, setAnomalyResults] = useState<AnomalyDetectionResult[]>([]);
  const [activeTab, setActiveTab] = useState('predictions');
  
  const runPredictionTest = async () => {
    setIsLoading(true);
    try {
      const results = await predictionTestingService.testPredictionAccuracy();
      setPredictionResults(results);
      setActiveTab('predictions');
    } finally {
      setIsLoading(false);
    }
  };
  
  const runAnomalyTest = async () => {
    setIsLoading(true);
    try {
      const results = await predictionTestingService.testAnomalyDetection();
      setAnomalyResults(results);
      setActiveTab('anomalies');
    } finally {
      setIsLoading(false);
    }
  };
  
  const runBenchmarkTest = async () => {
    setIsLoading(true);
    try {
      const results = await predictionTestingService.evaluateBenchmarkAccuracy();
      setPredictionResults(results);
      setActiveTab('predictions');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getAverageError = () => {
    if (predictionResults.length === 0) return 0;
    const sum = predictionResults.reduce((acc, result) => acc + result.errorPercentage, 0);
    return +(sum / predictionResults.length).toFixed(2);
  };
  
  const getAnomalyRate = () => {
    if (anomalyResults.length === 0) return 0;
    const anomalies = anomalyResults.filter(r => r.isAnomaly).length;
    return +((anomalies / anomalyResults.length) * 100).toFixed(2);
  };
  
  // Prepare chart data for predictions
  const predictionChartData = predictionResults.map(r => ({
    id: r.predictionId.substring(0, 8),
    actual: r.actualValue,
    predicted: r.predictedValue,
    error: r.errorPercentage,
    category: r.category
  }));
  
  // Prepare chart data for anomalies
  const anomalyChartData = anomalyResults.map(r => ({
    id: r.dataPointId.substring(0, 8),
    actual: r.actualValue,
    lowerBound: r.expectedRange[0],
    upperBound: r.expectedRange[1],
    isAnomaly: r.isAnomaly,
    confidence: r.confidence * 100,
    category: r.category
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" />
          AI Prediction Accuracy Testing
        </CardTitle>
        <CardDescription>
          Test and evaluate the accuracy of AI-generated predictions and anomaly detection
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={runPredictionTest}
            disabled={isLoading}
          >
            {isLoading && activeTab === 'predictions' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BarChart2 className="h-4 w-4" />
            )}
            Test Risk Predictions
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={runAnomalyTest}
            disabled={isLoading}
          >
            {isLoading && activeTab === 'anomalies' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            Test Anomaly Detection
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={runBenchmarkTest}
            disabled={isLoading}
          >
            {isLoading && activeTab === 'benchmarks' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Test Benchmark Accuracy
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="predictions">Prediction Testing</TabsTrigger>
              <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
            </TabsList>
            
            <TabsContent value="predictions">
              {predictionResults.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">Predictions Tested</p>
                      <p className="text-2xl font-bold">{predictionResults.length}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">Average Error</p>
                      <p className="text-2xl font-bold">{getAverageError()}%</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                      <p className="text-2xl font-bold">{100 - getAverageError()}%</p>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={predictionChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="id" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="actual" name="Actual Value" fill="#3b82f6" />
                        <Bar dataKey="predicted" name="Predicted Value" fill="#10b981" />
                        <Bar dataKey="error" name="Error %" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Actual</TableHead>
                        <TableHead>Predicted</TableHead>
                        <TableHead>Error</TableHead>
                        <TableHead>Error %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {predictionResults.map((result) => (
                        <TableRow key={result.predictionId}>
                          <TableCell className="font-mono">{result.predictionId.substring(0, 8)}...</TableCell>
                          <TableCell>{result.category}</TableCell>
                          <TableCell>{result.actualValue.toFixed(2)}</TableCell>
                          <TableCell>{result.predictedValue.toFixed(2)}</TableCell>
                          <TableCell>{result.error.toFixed(2)}</TableCell>
                          <TableCell>{result.errorPercentage.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Run a prediction test to see results
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="anomalies">
              {anomalyResults.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">Data Points Analyzed</p>
                      <p className="text-2xl font-bold">{anomalyResults.length}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">Anomalies Detected</p>
                      <p className="text-2xl font-bold">{anomalyResults.filter(r => r.isAnomaly).length}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">Anomaly Rate</p>
                      <p className="text-2xl font-bold">{getAnomalyRate()}%</p>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={anomalyChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="id" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="actual" name="Actual Value" fill="#3b82f6" />
                        <Bar dataKey="lowerBound" name="Lower Bound" fill="#a3a3a3" />
                        <Bar dataKey="upperBound" name="Upper Bound" fill="#a3a3a3" />
                        <Bar dataKey="confidence" name="Anomaly Confidence %" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Expected Range</TableHead>
                        <TableHead>Anomaly</TableHead>
                        <TableHead>Confidence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {anomalyResults.map((result) => (
                        <TableRow key={result.dataPointId}>
                          <TableCell className="font-mono">{result.dataPointId.substring(0, 8)}...</TableCell>
                          <TableCell>{result.category}</TableCell>
                          <TableCell>{result.actualValue.toFixed(2)}</TableCell>
                          <TableCell>
                            [{result.expectedRange[0].toFixed(2)}, {result.expectedRange[1].toFixed(2)}]
                          </TableCell>
                          <TableCell>
                            {result.isAnomaly ? (
                              <span className="flex items-center text-red-500">
                                <AlertTriangle className="h-4 w-4 mr-1" /> Yes
                              </span>
                            ) : (
                              <span className="flex items-center text-green-500">
                                <Check className="h-4 w-4 mr-1" /> No
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{(result.confidence * 100).toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Run an anomaly detection test to see results
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Results are for demonstration purposes only
        </p>
      </CardFooter>
    </Card>
  );
};

export default PredictionAccuracyTesting;
