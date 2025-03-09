
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
      const { regulationsService } = await import('./regulationsService');
      const response = await regulationsService.triggerESGScraper();
      
      // If the scraper was triggered successfully, fetch the regulations
      if (response) {
        const { data } = await regulationsService.getESGRegulations();
        return data;
      }
      return [];
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
      const { benchmarkService } = await import('./benchmarkService');
      const benchmarks = await benchmarkService.getESGBenchmarks(industry);
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
      const { competitorService } = await import('./competitorService');
      const competitors = await competitorService.getESGCompetitors();
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
export * from './regulationsService';
