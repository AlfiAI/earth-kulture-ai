
/**
 * ESG Benchmark from external data sources
 */
import { toast } from "sonner";

/**
 * Standard error handler for external services
 */
export function handleServiceError(
  error: any, 
  userMessage: string = "An error occurred", 
  context?: Record<string, any>
): void {
  // Log the full error details to console for debugging
  console.error("Service error:", error, context);
  
  // Show a user-friendly message with toast
  toast.error(userMessage);
  
  // Optional: Implement error tracking service integration here
  // errorTrackingService.capture(error, { context });
}

/**
 * Interface for paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

/**
 * Interface for external ESG dataset
 */
export interface ExternalESGDataset {
  id: string;
  name: string;
  description: string;
  provider: string;
  dataType: string;
  url: string;
  lastUpdated: string;
  coverage: {
    regions: string[];
    industries?: string[];
    years?: number[];
  };
  format: string;
  accessType: 'public' | 'subscription' | 'restricted';
  tags: string[];
}

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
