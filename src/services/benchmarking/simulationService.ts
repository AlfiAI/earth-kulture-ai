
import { ESGPrediction, SimulationAdjustment, PredictionCategory } from './types';
import { MockPredictionGenerator } from './mockPredictionGenerator';
import { toast } from "sonner";

export class SimulationService {
  /**
   * Run what-if simulation based on user inputs
   */
  static async runSimulation(
    category: PredictionCategory,
    adjustments: SimulationAdjustment[]
  ): Promise<ESGPrediction> {
    try {
      // In a real implementation, this would call an AI model
      // For demonstration, we're using a simplified approach
      
      const predictions = MockPredictionGenerator.getMockPredictions(category);
      if (predictions.length === 0) {
        throw new Error(`No predictions available for ${category}`);
      }
      
      const basePrediction = predictions[0];
      let adjustedValue = basePrediction.predictedValue;
      
      // Apply each adjustment factor
      adjustments.forEach(adjustment => {
        const matchingFactor = basePrediction.factors.find(f => f.name === adjustment.factor);
        if (matchingFactor) {
          // Calculate impact of this adjustment
          const impactMultiplier = adjustment.changePercent / 100;
          const valueChange = basePrediction.predictedValue * 
            Math.abs(matchingFactor.impact) * impactMultiplier;
          
          // Add or subtract based on the factor's direction
          if (matchingFactor.impact > 0) {
            adjustedValue += valueChange;
          } else {
            adjustedValue -= valueChange;
          }
        }
      });
      
      // Create a copy of the prediction with the adjusted value
      return {
        ...basePrediction,
        id: `sim-${Date.now()}`,
        predictedValue: adjustedValue,
        confidence: basePrediction.confidence * 0.9, // Slightly lower confidence for simulation
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error running ${category} simulation:`, error);
      toast.error(`Failed to run simulation for ${category}`);
      throw error;
    }
  }
}
