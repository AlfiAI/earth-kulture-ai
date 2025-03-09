
import { toast } from "sonner";
import { ESGBenchmark, ESGCompetitor, ESGRegulation } from './types/externalTypes';

// Class to handle all external data operations
class ExternalDataService {
  /**
   * Fetch latest regulatory updates
   */
  async fetchRegulations(): Promise<ESGRegulation[]> {
    try {
      // In a real app, this would call an API
      const regulations = await import('./regulationService').then(
        module => module.getESGRegulations()
      );
      return regulations.data;
    } catch (error) {
      console.error('Error fetching regulations:', error);
      toast.error('Failed to load regulatory data');
      return [];
    }
  }
  
  /**
   * Fetch industry benchmarks 
   */
  async fetchBenchmarks(industry?: string): Promise<ESGBenchmark[]> {
    try {
      const benchmarks = await import('./benchmarkService').then(
        module => module.getESGBenchmarks(industry)
      );
      return benchmarks;
    } catch (error) {
      console.error('Error fetching benchmarks:', error);
      toast.error('Failed to load benchmark data');
      return [];
    }
  }
  
  /**
   * Fetch competitor analysis data
   */
  async fetchCompetitorData(): Promise<ESGCompetitor[]> {
    try {
      const competitors = await import('./competitorService').then(
        module => module.getESGCompetitors()
      );
      return competitors;
    } catch (error) {
      console.error('Error fetching competitor data:', error);
      toast.error('Failed to load competitor data');
      return [];
    }
  }
}

export const externalDataService = new ExternalDataService();

// Combined export to simplify imports
export type { ESGBenchmark, ESGCompetitor, ESGRegulation } from './types/externalTypes';
export * from './benchmarkService';
export * from './competitorService';
export * from './regulationService';
