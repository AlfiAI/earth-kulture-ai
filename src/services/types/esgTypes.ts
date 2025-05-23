
// ESG data schemas and types
export interface ESGDataPoint {
  id: string;
  category: 'environmental' | 'social' | 'governance';
  subCategory: string;
  value: number;
  unit: string;
  source: string;
  date: string;
  verified: boolean;
  notes?: string;
}

export interface CarbonEmission {
  id: string;
  scope: 'scope1' | 'scope2' | 'scope3';
  category?: string; // Make category optional since the service doesn't always provide it
  source: string;
  amount: number;
  unit: 'tCO2e' | 'kgCO2e';
  date: string; // Changed from Date to string to match implementation
  location?: string;
  notes?: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  category: string;
  region?: string;
  requirements: ComplianceRequirement[];
  lastUpdated: string;
  deadline?: string;
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'in-progress' | 'attention-needed' | 'not-started';
  score: number;
  lastUpdated: string;
}

// AI insights type
export interface AIInsight {
  type: 'trend' | 'recommendation' | 'alert' | 'info';
  title: string;
  description: string;
  date: string;
  indicator?: 'up' | 'down' | 'stable';
  percentageChange?: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

// ESG Score interface
export interface ESGScore {
  overall: number;
  environmental: number;
  social: number;
  governance: number;
  trend: 'improving' | 'stable' | 'declining';
  comparisonToIndustry: 'above average' | 'average' | 'below average';
  lastUpdated: string;
}

// ESG Report interface
export interface ESGReport {
  id: string;
  title: string;
  dateGenerated: string;
  dateRange: { start: string, end: string };
  frameworks: string[];
  focusAreas: string[];
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  sections: { title: string, content: string }[];
  dataPoints: {
    totalCarbonEmissions: number;
    renewableEnergyPercentage: number;
    wasteRecyclingRate: number;
    waterUsage: number;
    complianceScore: number;
  };
}

// Action Step interface for sustainability goals
export interface ActionStep {
  id: string;
  description: string;
  deadline?: string;
  status: 'complete' | 'in-progress' | 'not-started';
  impact: 'high' | 'medium' | 'low';
  estimatedCost?: {
    amount: number;
    currency: string;
  };
  estimatedReduction?: {
    amount: number;
    unit: string;
  };
}

// Sustainability Goal interface
export interface SustainabilityGoal {
  id: string;
  name: string;
  category: 'social' | 'governance' | 'carbon' | 'energy' | 'waste' | 'water';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  startDate: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'completed' | 'at-risk' | 'behind';
  actionPlan?: ActionStep[] | string;
}
