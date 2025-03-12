
/**
 * Type definitions for the Decision Intelligence system
 */

// Risk analysis result type
export interface RiskAnalysisResult {
  riskScore: number;
  confidenceLevel: number;
  factors: {
    name: string;
    impact: number;
    description: string;
  }[];
  mitigationStrategies: string[];
  summary: string;
}

// Recommendation type
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  timeframe: 'short-term' | 'medium-term' | 'long-term';
  priority: number;
  relatedMetrics: string[];
  expectedOutcome: string;
}

// Outcome prediction type
export interface OutcomePrediction {
  scenario: string;
  probability: number;
  outcomes: {
    metric: string;
    currentValue: number;
    predictedValue: number;
    confidenceInterval: [number, number];
  }[];
  timeHorizon: string;
  assumptions: string[];
  riskFactors: string[];
}
