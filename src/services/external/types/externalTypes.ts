
import { toast } from "sonner";
import { captureException } from "@/services/monitoring/errorTracking";

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

// Error details interface for better error context
export interface ErrorDetails {
  context?: Record<string, any>;
  operation: string;
  message: string;
  originalError?: any;
}

// Error handling utility with improved context and logging
export const handleServiceError = (error: any, errorMessage: string, context?: Record<string, any>): void => {
  // Create structured error details
  const errorDetails: ErrorDetails = {
    message: errorMessage,
    operation: context?.operation || 'unknown_operation',
    context: context || {},
    originalError: error
  };
  
  // Log error with full context
  console.error(errorMessage, errorDetails);
  
  // Send to error tracking system
  captureException(error, errorDetails);
  
  // Show user-friendly message
  toast.error(errorMessage);
};
