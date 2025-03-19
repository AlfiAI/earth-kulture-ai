
export interface ESGScores {
  total: number;
  environmental: number;
  social: number;
  governance: number;
  totalTrend: 'up' | 'down' | 'stable';
  environmentalTrend: 'up' | 'down' | 'stable';
  socialTrend: 'up' | 'down' | 'stable';
  governanceTrend: 'up' | 'down' | 'stable';
}

export interface CompanyESGData {
  name: string;
  ticker: string;
  industry: string;
  esgScores: ESGScores;
  lastUpdated: string;
  reportUrl?: string;
}

export interface IndustryComparisonData {
  industryName: string;
  industryAverage: {
    total: number;
    environmental: number;
    social: number;
    governance: number;
  };
  topPerformer: {
    name: string;
    ticker: string;
    total: number;
    environmental: number;
    social: number;
    governance: number;
  };
  peerCount: number;
}
