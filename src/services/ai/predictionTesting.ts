
import { toast } from "sonner";
import { RiskPrediction, riskPredictionService } from "./riskPredictionService";
import { AIBenchmarkResult, aiBenchmarkingService } from "../benchmarking/aiBenchmarkingService";
import { supabase } from "@/integrations/supabase/client";

export interface PredictionAccuracyResult {
  predictionId: string;
  actualValue: number;
  predictedValue: number;
  error: number;
  errorPercentage: number;
  category: string;
  timestamp: string;
}

export interface AnomalyDetectionResult {
  dataPointId: string;
  isAnomaly: boolean;
  confidence: number;
  expectedRange: [number, number];
  actualValue: number;
  deviation: number;
  category: string;
  timestamp: string;
}

/**
 * Service for testing and evaluating AI prediction and anomaly detection accuracy
 */
class PredictionTestingService {
  /**
   * Test the accuracy of risk predictions by comparing with actual outcomes
   */
  async testPredictionAccuracy(
    predictionsToTest: string[] = []
  ): Promise<PredictionAccuracyResult[]> {
    try {
      // Get predictions to test - either the specified ones or the most recent ones
      const predictions = predictionsToTest.length > 0 
        ? await this.getPredictionsByIds(predictionsToTest)
        : await riskPredictionService.getUserPredictions();
      
      if (predictions.length === 0) {
        toast.warning("No predictions available to test");
        return [];
      }
      
      // For each prediction, compare with actual outcomes
      const results: PredictionAccuracyResult[] = [];
      
      for (const prediction of predictions) {
        // In a real implementation, we would fetch actual outcome data from a database
        // For demo purposes, we'll simulate actual outcomes
        const actualValue = this.simulateActualOutcome(prediction);
        
        // Find the predicted value (using the first factor's impact for demo)
        const predictedValue = prediction.riskScore;
        
        // Calculate error metrics
        const error = Math.abs(actualValue - predictedValue);
        const errorPercentage = (error / actualValue) * 100;
        
        results.push({
          predictionId: prediction.id,
          actualValue,
          predictedValue,
          error,
          errorPercentage,
          category: prediction.category,
          timestamp: new Date().toISOString()
        });
      }
      
      // In a real implementation, we would store the results
      // For demo purposes, we'll log them and return them
      console.log("Prediction accuracy test results:", results);
      
      toast.success(`Tested accuracy of ${results.length} predictions`);
      return results;
    } catch (error) {
      console.error("Error testing prediction accuracy:", error);
      toast.error("Failed to test prediction accuracy");
      return [];
    }
  }
  
  /**
   * Test anomaly detection by analyzing recent data points
   */
  async testAnomalyDetection(): Promise<AnomalyDetectionResult[]> {
    try {
      // In a real implementation, we would use a trained ML model
      // For demo purposes, we'll use statistical methods on mock data
      
      // Generate mock data points
      const dataPoints = this.generateMockDataPoints();
      
      // Detect anomalies
      const results: AnomalyDetectionResult[] = [];
      
      for (const dataPoint of dataPoints) {
        const category = dataPoint.category;
        const value = dataPoint.value;
        
        // Calculate simple statistical bounds (mean ± 2*stddev)
        const expectedMean = dataPoint.expectedMean;
        const expectedStdDev = dataPoint.expectedStdDev;
        const lowerBound = expectedMean - (2 * expectedStdDev);
        const upperBound = expectedMean + (2 * expectedStdDev);
        
        const isAnomaly = value < lowerBound || value > upperBound;
        const deviation = Math.abs(value - expectedMean) / expectedStdDev;
        
        // Calculate confidence based on how far outside bounds
        const confidence = isAnomaly 
          ? Math.min(0.99, 0.5 + (deviation - 2) * 0.1)
          : Math.max(0.01, 0.5 - deviation * 0.2);
        
        results.push({
          dataPointId: dataPoint.id,
          isAnomaly,
          confidence,
          expectedRange: [lowerBound, upperBound],
          actualValue: value,
          deviation,
          category,
          timestamp: new Date().toISOString()
        });
      }
      
      // In a real implementation, we would store the results
      // For demo purposes, we'll log them and return them
      console.log("Anomaly detection test results:", results);
      
      toast.success(`Tested anomaly detection on ${results.length} data points`);
      return results;
    } catch (error) {
      console.error("Error testing anomaly detection:", error);
      toast.error("Failed to test anomaly detection");
      return [];
    }
  }
  
  /**
   * Evaluate benchmark prediction accuracy
   */
  async evaluateBenchmarkAccuracy(): Promise<PredictionAccuracyResult[]> {
    try {
      const benchmarks = await aiBenchmarkingService.getBenchmarkResults();
      
      if (benchmarks.length === 0) {
        toast.warning("No benchmark results available to evaluate");
        return [];
      }
      
      // For each benchmark, compare with actual outcomes
      const results: PredictionAccuracyResult[] = [];
      
      for (const benchmark of benchmarks) {
        // In a real implementation, we would fetch actual outcome data
        // For demo purposes, we'll simulate actual outcomes
        const actualValue = this.simulateBenchmarkOutcome(benchmark);
        const predictedValue = benchmark.score;
        
        // Calculate error metrics
        const error = Math.abs(actualValue - predictedValue);
        const errorPercentage = (error / actualValue) * 100;
        
        results.push({
          predictionId: benchmark.id,
          actualValue,
          predictedValue,
          error,
          errorPercentage,
          category: benchmark.category,
          timestamp: new Date().toISOString()
        });
      }
      
      toast.success(`Evaluated accuracy of ${results.length} benchmark predictions`);
      return results;
    } catch (error) {
      console.error("Error evaluating benchmark accuracy:", error);
      toast.error("Failed to evaluate benchmark accuracy");
      return [];
    }
  }
  
  /**
   * Simulate actual outcome for a prediction (for demo purposes)
   */
  private simulateActualOutcome(prediction: RiskPrediction): number {
    // Apply some random variation to the predicted value
    const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
    let actualValue = prediction.riskScore * randomFactor;
    
    // Ensure within bounds
    actualValue = Math.max(0, Math.min(100, actualValue));
    
    return Number(actualValue.toFixed(2));
  }
  
  /**
   * Simulate actual outcome for a benchmark (for demo purposes)
   */
  private simulateBenchmarkOutcome(benchmark: AIBenchmarkResult): number {
    // Apply some random variation to the benchmark score
    const randomFactor = 0.85 + (Math.random() * 0.3); // 0.85 to 1.15
    let actualValue = benchmark.score * randomFactor;
    
    // Ensure within bounds
    actualValue = Math.max(0, Math.min(100, actualValue));
    
    return Number(actualValue.toFixed(2));
  }
  
  /**
   * Get prediction by IDs
   */
  private async getPredictionsByIds(ids: string[]): Promise<RiskPrediction[]> {
    try {
      const predictions = await riskPredictionService.getUserPredictions();
      return predictions.filter(p => ids.includes(p.id));
    } catch (error) {
      console.error("Error fetching predictions by IDs:", error);
      return [];
    }
  }
  
  /**
   * Store accuracy results (commented out since table doesn't exist yet)
   */
  private async storeAccuracyResults(results: PredictionAccuracyResult[]): Promise<void> {
    try {
      // We'll just log for now instead of storing in potentially non-existent tables
      console.log("Would store prediction accuracy results:", results);
      // In a real implementation with tables created:
      // const { error } = await supabase
      //   .from('esg_prediction_accuracy')
      //   .insert(results.map(result => ({
      //     prediction_id: result.predictionId,
      //     actual_value: result.actualValue,
      //     predicted_value: result.predictedValue,
      //     error: result.error,
      //     error_percentage: result.errorPercentage,
      //     category: result.category,
      //     test_timestamp: new Date().toISOString()
      //   })));
      // 
      // if (error) throw error;
    } catch (error) {
      console.error("Error storing accuracy results:", error);
    }
  }
  
  /**
   * Store anomaly detection results (commented out since table doesn't exist yet)
   */
  private async storeAnomalyResults(results: AnomalyDetectionResult[]): Promise<void> {
    try {
      // We'll just log for now instead of storing in potentially non-existent tables
      console.log("Would store anomaly detection results:", results);
      // In a real implementation with tables created:
      // const { error } = await supabase
      //   .from('esg_anomaly_detection')
      //   .insert(results.map(result => ({
      //     data_point_id: result.dataPointId,
      //     is_anomaly: result.isAnomaly,
      //     confidence: result.confidence,
      //     expected_lower: result.expectedRange[0],
      //     expected_upper: result.expectedRange[1],
      //     actual_value: result.actualValue,
      //     deviation: result.deviation,
      //     category: result.category,
      //     test_timestamp: new Date().toISOString()
      //   })));
      // 
      // if (error) throw error;
    } catch (error) {
      console.error("Error storing anomaly results:", error);
    }
  }
  
  /**
   * Generate mock data points for anomaly testing
   */
  private generateMockDataPoints(): Array<{
    id: string;
    category: string;
    value: number;
    expectedMean: number;
    expectedStdDev: number;
  }> {
    const categories = ['emissions', 'energy', 'water', 'waste', 'social'];
    const dataPoints = [];
    
    // Generate 50 mock data points
    for (let i = 0; i < 50; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const expectedMean = 50 + (Math.random() * 50);
      const expectedStdDev = 5 + (Math.random() * 10);
      
      // Introduce some anomalies (about 10% of data points)
      const isAnomaly = Math.random() < 0.1;
      let value;
      
      if (isAnomaly) {
        // Value outside expected range
        const direction = Math.random() > 0.5 ? 1 : -1;
        value = expectedMean + (direction * (expectedStdDev * (2.5 + Math.random() * 2)));
      } else {
        // Value within expected range
        value = expectedMean + ((Math.random() * 2 - 1) * expectedStdDev);
      }
      
      // Ensure positive values
      value = Math.max(0, value);
      
      dataPoints.push({
        id: `mock-${i}`,
        category,
        value,
        expectedMean,
        expectedStdDev
      });
    }
    
    return dataPoints;
  }
}

export const predictionTestingService = new PredictionTestingService();
