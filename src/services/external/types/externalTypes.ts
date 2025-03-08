
import { toast } from "sonner";

export interface ESGBenchmark {
  id: string;
  industry: string;
  benchmark_name: string;
  benchmark_value: number;
  unit: string;
  source: string;
  year: number;
  region: string;
  category: string;
  created_at: string;
}

export interface ESGCompetitor {
  id: string;
  company_name: string;
  industry: string;
  esg_score: number;
  environmental_score: number;
  social_score: number;
  governance_score: number;
  report_year: number;
  report_url?: string;
  highlights?: string[];
  created_at: string;
}

// Updated to match the esg_regulatory_updates table structure
export interface ESGRegulation {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  category?: string;
  impact_level?: string;
  published_date?: string;
  tags?: string[];
  country?: string;
  scraped_at?: string;
  relevance_score?: number;
}

export interface ExternalESGDataset {
  id: string;
  dataset_name: string;
  dataset_description?: string;
  category: string;
  source: string;
  data: any;
  metrics?: string[];
  last_updated?: string;
  next_update?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
}

// Error handling for external services
export function handleServiceError(
  error: any, 
  message: string, 
  metadata?: Record<string, any>
): void {
  console.error(message, error, metadata);
  toast.error(message);
  
  // Add additional error tracking here in production
  // e.g., Sentry.captureException(error, { extra: metadata });
}
