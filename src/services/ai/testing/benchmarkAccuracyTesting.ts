
import { toast } from "sonner";
import { AIBenchmarkResult, aiBenchmarkingService } from "../../benchmarking/aiBenchmarkingService";
import { PredictionAccuracyResult } from "../types/predictionTestingTypes";
import { simulateBenchmarkOutcome } from "../utils/predictionTestingUtils";

/**
 * Evaluate benchmark prediction accuracy
 */
export async function evaluateBenchmarkAccuracy(): Promise<PredictionAccuracyResult[]> {
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
      const actualValue = simulateBenchmarkOutcome(benchmark);
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
