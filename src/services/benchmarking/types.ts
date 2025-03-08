
export interface ESGPrediction {
  id: string;
  category: 'esg' | 'carbon' | 'compliance' | 'financial';
  currentValue: number;
  predictedValue: number;
  predictedDate: string;
  trendDirection: 'up' | 'down' | 'stable';
  confidence: number;
  factors: Array<{
    name: string;
    impact: number;
  }>;
}

export interface SimulationAdjustment {
  metricName: string;
  value: number;
  originalValue: number;
}

export type PredictionCategory = 'esg' | 'carbon' | 'compliance' | 'financial';

export interface CompetitorSustainabilityData {
  companyId: string;
  companyName: string;
  industry: string;
  esgScore: number;
  carbonScore: number;
  socialScore: number;
  governanceScore: number;
  complianceRate: number;
  reportYear: number;
  changeFromPrevYear: number;
  highlights: string[];
  risks: string[];
}

export interface ESGBenchmarkingResult {
  industryAverage: number;
  topPerformerScore: number;
  yourScore: number;
  percentile: number;
  improvementAreas: Array<{
    area: string;
    potentialImprovement: number;
    recommendation: string;
  }>;
  trends: Array<{
    period: string;
    industryAvg: number;
    yourScore: number;
  }>;
}
