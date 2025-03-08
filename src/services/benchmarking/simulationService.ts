
import { ESGPrediction, SimulationAdjustment, PredictionCategory } from './types';
import { MockPredictionGenerator } from './mockPredictionGenerator';

export class SimulationService {
  /**
   * Run a what-if simulation based on adjustments to see potential ESG outcomes
   */
  static async runSimulation(
    category: PredictionCategory,
    adjustments: SimulationAdjustment[]
  ): Promise<ESGPrediction> {
    // Get a base prediction to modify
    const basePredictions = MockPredictionGenerator.getMockPredictions(category);
    
    if (basePredictions.length === 0) {
      throw new Error(`No predictions available for category: ${category}`);
    }
    
    const basePrediction = { ...basePredictions[0] };
    
    // Calculate impact of adjustments
    let totalImpact = 0;
    const impactFactors: ESGPrediction['factors'] = [];
    
    adjustments.forEach(adjustment => {
      // Calculate percentage change
      const percentageChange = (adjustment.value - adjustment.originalValue) / adjustment.originalValue;
      
      // Each adjustment contributes to the overall impact based on its size
      let impact = 0;
      
      // Different metrics have different impacts on different categories
      switch (category) {
        case 'esg':
          // For ESG, improvements in any area help the score
          impact = percentageChange * 0.25; // 25% effect per metric on average
          break;
          
        case 'carbon':
          // For carbon, reducing values is positive (negative correlation)
          impact = -percentageChange * 0.33; // 33% effect per metric
          break;
          
        case 'compliance':
          // For compliance, increases directly impact score
          impact = percentageChange * 0.5; // 50% effect per metric
          break;
          
        case 'financial':
          // Financial impact varies based on the specific adjustment
          impact = percentageChange * 0.4; // 40% effect per metric
          break;
      }
      
      totalImpact += impact;
      
      // Add to factors
      impactFactors.push({
        name: adjustment.metricName,
        impact: impact
      });
    });
    
    // Apply the total impact to the base prediction
    let newValue = basePrediction.predictedValue;
    
    if (category === 'carbon') {
      // For carbon, negative impact is good (reducing emissions)
      newValue = Math.max(0, basePrediction.predictedValue * (1 + totalImpact));
    } else {
      // For other categories, positive impact is good
      newValue = basePrediction.predictedValue * (1 + totalImpact);
    }
    
    // Determine trend direction
    let trendDirection: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(totalImpact) < 0.03) {
      trendDirection = 'stable'; 
    } else if ((category === 'carbon' && totalImpact < 0) || 
               (category !== 'carbon' && totalImpact > 0)) {
      trendDirection = 'up'; // Positive trend (for carbon, down is up)
    } else {
      trendDirection = 'down'; // Negative trend
    }
    
    // Build the simulation result
    return {
      id: `simulation-${Date.now()}`,
      category,
      currentValue: basePrediction.currentValue,
      predictedValue: Math.round(newValue * 100) / 100, // Round to 2 decimal places
      predictedDate: basePrediction.predictedDate,
      trendDirection,
      confidence: Math.max(0.5, basePrediction.confidence - 0.15), // Slightly lower confidence for simulations
      factors: impactFactors
    };
  }
}
