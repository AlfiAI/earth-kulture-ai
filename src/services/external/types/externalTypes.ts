
/**
 * ESG Benchmark from external data sources
 */
export interface ESGBenchmark {
  id: string;
  benchmark_name: string;
  benchmark_value: number;
  industry: string;
  category: string;
  source: string;
  region?: string;
  unit?: string;
  year?: number;
}

/**
 * ESG Competitor information
 */
export interface ESGCompetitor {
  id: string;
  company_name: string;
  industry: string;
  esg_score: number;
  environmental_score: number;
  social_score: number;
  governance_score: number;
  report_year?: number;
  report_url?: string;
  highlights?: string[];
  last_updated: string;
  
  // For UI display purposes
  name?: string; // Alias for company_name
  isLeader?: boolean; // Computed property
  scores?: {
    environmental: number;
    social: number;
    governance: number;
  };
  trends?: {
    environmental: 'improving' | 'declining' | 'stable';
    social: 'improving' | 'declining' | 'stable';
    governance: 'improving' | 'declining' | 'stable';
  };
  carbonData?: {
    intensity: number;
    netZeroTarget: string;
  };
}

/**
 * ESG Regulation update
 */
export interface ESGRegulation {
  id: string;
  title: string;
  content: string;
  url: string;
  source: string;
  category: string;
  published_date: string;
  country?: string;
  impact_level?: string;
  relevance_score?: number;
  tags?: string[];
}
