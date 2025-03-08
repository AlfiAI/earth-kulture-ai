
import { toast } from "sonner";
import { RiskPrediction, riskPredictionService } from "../riskPredictionService";
import { PredictionAccuracyResult } from "../types/predictionTestingTypes";
import { simulateActualOutcome } from "../utils/predictionTestingUtils";

/**
 * Test the accuracy of risk predictions by comparing with actual outcomes
 */
export async function testPredictionAccuracy(
  predictionsToTest: string[] = []
): Promise<PredictionAccuracyResult[]> {
  try {
    // Get predictions to test - either the specified ones or the most recent ones
    const predictions = predictionsToTest.length > 0 
      ? await getPredictionsByIds(predictionsToTest)
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
      const actualValue = simulateActualOutcome(prediction);
      
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
 * Get prediction by IDs
 */
async function getPredictionsByIds(ids: string[]): Promise<RiskPrediction[]> {
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
export async function storeAccuracyResults(results: PredictionAccuracyResult[]): Promise<void> {
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
