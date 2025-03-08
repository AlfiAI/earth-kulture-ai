
/**
 * Types for risk prediction functionality
 */

export interface RiskFactor {
  name: string;
  impact: number; // -1 to 1 range, negative means reducing the risk
  recommendation?: string;
}

export interface RiskPredictionDetail {
  key: string;
  value: string | number;
  icon?: string;
}

export interface RiskPrediction {
  id: string;
  category: string;
  metricName: string;
  riskScore: number;
  confidenceLevel: number;
  prediction: string;
  date: string;
  isCritical: boolean;
  factors: RiskFactor[];
  trend: 'increasing' | 'decreasing' | 'stable';
  details: RiskPredictionDetail[];
}

export interface ESGRiskPredictionRequest {
  userId: string;
  category: string;
  dataPoints: {
    metric: string;
    value: number;
    date: string;
  }[];
  complianceFrameworks: string[];
  industryBenchmarks: Record<string, number>;
}
