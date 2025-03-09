
import { toast } from "sonner";
import { BenchmarkData, CompetitorData, RegulationData } from './types/externalTypes';

// Class to handle all external data operations
class ExternalDataService {
  /**
   * Fetch latest regulatory updates
   */
  async fetchRegulations(): Promise<RegulationData[]> {
    try {
      // In a real app, this would call an API
      const regulations = await import('./regulationService').then(
        module => module.fetchRegulations()
      );
      return regulations;
    } catch (error) {
      console.error('Error fetching regulations:', error);
      toast.error('Failed to load regulatory data');
      return [];
    }
  }
  
  /**
   * Fetch industry benchmarks 
   */
  async fetchBenchmarks(industry?: string): Promise<BenchmarkData[]> {
    try {
      const benchmarks = await import('./benchmarkService').then(
        module => module.fetchBenchmarkData(industry)
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
  async fetchCompetitorData(): Promise<CompetitorData[]> {
    try {
      const competitors = await import('./competitorService').then(
        module => module.fetchCompetitorData()
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
export * from './types/externalTypes';
export * from './benchmarkService';
export * from './competitorService';
export * from './regulationService';
