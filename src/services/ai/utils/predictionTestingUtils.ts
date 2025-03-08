
import { RiskPrediction } from "../types/riskPredictionTypes";
import { AIBenchmarkResult } from "../../benchmarking/aiBenchmarkingService";
import { MockDataPoint, PredictionAccuracyResult, AnomalyDetectionResult } from "../types/predictionTestingTypes";

/**
 * Simulate actual outcome for a prediction (for demo purposes)
 */
export function simulateActualOutcome(prediction: RiskPrediction): number {
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
export function simulateBenchmarkOutcome(benchmark: AIBenchmarkResult): number {
  // Apply some random variation to the benchmark score
  const randomFactor = 0.85 + (Math.random() * 0.3); // 0.85 to 1.15
  let actualValue = benchmark.score * randomFactor;
  
  // Ensure within bounds
  actualValue = Math.max(0, Math.min(100, actualValue));
  
  return Number(actualValue.toFixed(2));
}

/**
 * Generate mock data points for anomaly testing
 */
export function generateMockDataPoints(): MockDataPoint[] {
  const categories = ['emissions', 'energy', 'water', 'waste', 'social'];
  const dataPoints: MockDataPoint[] = [];
  
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

/**
 * Calculate anomaly detection results from data points
 */
export function calculateAnomalyResults(dataPoints: MockDataPoint[]): AnomalyDetectionResult[] {
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
  
  return results;
}
