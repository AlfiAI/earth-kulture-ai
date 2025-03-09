
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
  page: number;
  pageSize: number;
  hasMore: boolean;
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
