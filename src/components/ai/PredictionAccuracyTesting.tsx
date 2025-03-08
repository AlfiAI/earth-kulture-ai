import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, BarChart2, AlertTriangle, Activity, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { predictionTestingService, PredictionAccuracyResult, AnomalyDetectionResult } from "@/services/ai/predictionTesting";

const PredictionAccuracyTesting = () => {
  const [activeTab, setActiveTab] = useState("prediction");
  const [predictionResults, setPredictionResults] = useState<PredictionAccuracyResult[]>([]);
  const [anomalyResults, setAnomalyResults] = useState<AnomalyDetectionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testPredictionAccuracy = async () => {
    setIsLoading(true);
    try {
      const results = await predictionTestingService.testPredictionAccuracy();
      setPredictionResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  const testAnomalyDetection = async () => {
    setIsLoading(true);
    try {
      const results = await predictionTestingService.testAnomalyDetection();
      setAnomalyResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Testing</CardTitle>
        <CardDescription>
          Evaluate the accuracy of AI predictions and anomaly detection.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="prediction" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="prediction">
              <BarChart className="mr-2 h-4 w-4" />
              Prediction Accuracy
            </TabsTrigger>
            <TabsTrigger value="anomaly">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Anomaly Detection
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="prediction" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Prediction Accuracy Testing</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testPredictionAccuracy} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Run Prediction Test
                  </>
                )}
              </Button>
            </div>
            
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            
            {predictionResults.length > 0 ? (
              <div className="space-y-2">
                {predictionResults.map((result) => (
                  <div key={result.predictionId} className="border rounded-md p-3">
                    <p className="text-sm font-medium">
                      Prediction ID: {result.predictionId}
                    </p>
                    <p className="text-sm">
                      Actual Value: {result.actualValue}, Predicted Value: {result.predictedValue}
                    </p>
                    <p className="text-sm">
                      Error: {result.error.toFixed(2)}, Error Percentage: {result.errorPercentage.toFixed(2)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Category: {result.category}, Timestamp: {result.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">
                No prediction accuracy results yet. Run a test to see results.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="anomaly" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Anomaly Detection Testing</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testAnomalyDetection} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Run Anomaly Test
                  </>
                )}
              </Button>
            </div>
            
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            
            {anomalyResults.length > 0 ? (
              <div className="space-y-2">
                {anomalyResults.map((result) => (
                  <div key={result.dataPointId} className="border rounded-md p-3">
                    <p className="text-sm font-medium">
                      Data Point ID: {result.dataPointId}
                    </p>
                    <p className="text-sm">
                      Is Anomaly: {result.isAnomaly ? "Yes" : "No"}, Confidence: {result.confidence.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      Actual Value: {result.actualValue}, Expected Range: {result.expectedRange[0].toFixed(2)} - {result.expectedRange[1].toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Category: {result.category}, Timestamp: {result.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">
                No anomaly detection results yet. Run a test to see results.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PredictionAccuracyTesting;
