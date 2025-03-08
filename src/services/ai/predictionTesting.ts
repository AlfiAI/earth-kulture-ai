
import { testPredictionAccuracy } from "./testing/predictionAccuracyTesting";
import { testAnomalyDetection } from "./testing/anomalyDetectionTesting";
import { evaluateBenchmarkAccuracy } from "./testing/benchmarkAccuracyTesting";
import { PredictionAccuracyResult, AnomalyDetectionResult } from "./types/predictionTestingTypes";

/**
 * Service for testing and evaluating AI prediction and anomaly detection accuracy
 */
class PredictionTestingService {
  testPredictionAccuracy = testPredictionAccuracy;
  testAnomalyDetection = testAnomalyDetection;
  evaluateBenchmarkAccuracy = evaluateBenchmarkAccuracy;
}

export const predictionTestingService = new PredictionTestingService();
export type { PredictionAccuracyResult, AnomalyDetectionResult };
