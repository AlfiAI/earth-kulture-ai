
import { toast } from "sonner";
import { ESGPrediction, PredictionCategory, SimulationAdjustment } from './types';
import { MockPredictionGenerator } from './mockPredictionGenerator';
import { SimulationService } from './simulationService';

class BenchmarkingService {
  /**
   * Get AI-generated predictions for different categories
   */
  async getPredictions(category: PredictionCategory): Promise<ESGPrediction[]> {
    try {
      // This would be connected to a real AI model in production
      // Currently using mock data to demonstrate the UI
      return MockPredictionGenerator.getMockPredictions(category);
    } catch (error) {
      console.error(`Error fetching ${category} predictions:`, error);
      toast.error(`Failed to load predictions for ${category}`);
      return [];
    }
  }
  
  /**
   * Run what-if simulation based on user inputs
   */
  async runSimulation(
    category: PredictionCategory,
    adjustments: SimulationAdjustment[]
  ): Promise<ESGPrediction> {
    return SimulationService.runSimulation(category, adjustments);
  }
}

export const benchmarkingService = new BenchmarkingService();
