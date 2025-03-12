
/**
 * Types for AI Decision Intelligence
 */

// Risk analysis result
export interface RiskAnalysisResult {
  overallRiskScore: number;
  riskFactors: Array<{
    factor: string;
    score: number;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  mitigationStrategies: Array<{
    strategy: string;
    effectivenessScore: number;
    implementationComplexity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  complianceImpact: {
    regulatoryExposure: string[];
    reportingRequirements: string[];
  };
  confidenceLevel: number;
  analysisTimestamp: string;
}

// Recommendation
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'environmental' | 'social' | 'governance' | 'general';
  impact: {
    esgScore: number;
    riskReduction: number;
    costSavings?: number;
    timeToImplement: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  };
  priority: 'low' | 'medium' | 'high';
  implementationSteps: string[];
  metrics: {
    name: string;
    current: number;
    projected: number;
    unit: string;
  }[];
  confidenceScore: number;
}

// Outcome prediction
export interface OutcomePrediction {
  scenarioId: string;
  scenarioName: string;
  outcomes: {
    environmental: {
      carbonFootprint: number;
      wasteReduction: number;
      energyEfficiency: number;
      resourceConsumption: number;
    };
    social: {
      stakeholderSatisfaction: number;
      communityImpact: number;
      employeeWellbeing: number;
    };
    governance: {
      regulatoryCompliance: number;
      transparencyScore: number;
      riskExposure: number;
    };
    financial: {
      implementationCost: number;
      roi: number;
      paybackPeriod: number;
    };
  };
  timeline: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  confidenceScore: number;
  assumptions: string[];
  sensitivityFactors: string[];
  predictionDate: string;
}

// Decision criteria for evaluating options
export interface DecisionCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  category: 'environmental' | 'social' | 'governance' | 'financial' | 'operational';
  evaluationMethod: 'quantitative' | 'qualitative';
  scale?: {
    min: number;
    max: number;
    step: number;
    unit: string;
  };
}

// Decision option with evaluation against criteria
export interface DecisionOption {
  id: string;
  name: string;
  description: string;
  evaluations: Array<{
    criteriaId: string;
    score: number;
    rationale: string;
  }>;
  risks: Array<{
    description: string;
    probability: number;
    impact: number;
    mitigationStrategy: string;
  }>;
  resources: {
    budget: number;
    personnelHours: number;
    timeline: string;
  };
}
