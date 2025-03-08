
import { toast } from "sonner";

// External data interfaces
export interface ExternalESGDataset {
  id: string;
  source: string;
  dataset_name: string;
  dataset_description?: string;
  data: any;
  category: string;
  last_updated: string;
  next_update?: string;
  metrics?: string[];
}

export interface ESGRegulation {
  id: string;
  source: string;
  title: string;
  content: string;
  url: string;
  category: string;
  country?: string;
  published_date?: string;
  impact_level?: string;
  scraped_at: string;
  relevance_score?: number;
  tags?: string[];
}

export interface ESGBenchmark {
  id: string;
  industry: string;
  benchmark_name: string;
  benchmark_value: number;
  unit?: string;
  source: string;
  year?: number;
  region?: string;
  category: string;
  created_at: string;
}

export interface ESGCompetitor {
  id: string;
  company_name: string;
  industry: string;
  esg_score?: number;
  environmental_score?: number;
  social_score?: number;
  governance_score?: number;
  report_url?: string;
  report_year?: number;
  highlights?: string[];
  created_at: string;
  last_updated: string;
}

// Generic pagination response interface
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
}

// Error handling utility
export const handleServiceError = (error: any, errorMessage: string): void => {
  console.error(errorMessage, error);
  toast.error(errorMessage);
};
