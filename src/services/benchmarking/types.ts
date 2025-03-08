
// Types for ESG predictions
export interface ESGPrediction {
  id: string;
  category: 'esg' | 'carbon' | 'compliance' | 'financial';
  metricName: string;
  currentValue: number;
  predictedValue: number;
  predictedDate: string;
  confidence: number;
  trendDirection: 'up' | 'down' | 'stable';
  factors: {
    name: string;
    impact: number; // -1 to 1 range, negative means reducing the metric
  }[];
  createdAt: string;
}

export type PredictionCategory = 'esg' | 'carbon' | 'compliance' | 'financial';

export interface SimulationAdjustment {
  factor: string;
  changePercent: number;
}
