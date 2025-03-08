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

export interface ESGRegulation {
  id: string;
  name: string;
  region: string;
  effective_date: string;
  status: 'upcoming' | 'active' | 'superseded';
  summary: string;
  sectors: string[];
  compliance_deadline: string;
  created_at: string;
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
