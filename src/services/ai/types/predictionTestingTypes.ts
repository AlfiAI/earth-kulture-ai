
import { RiskPrediction } from "./riskPredictionTypes";
import { AIBenchmarkResult } from "../../benchmarking/aiBenchmarkingService";

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

export interface MockDataPoint {
  id: string;
  category: string;
  value: number;
  expectedMean: number;
  expectedStdDev: number;
}
