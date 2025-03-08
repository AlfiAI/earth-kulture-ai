
import { supabase } from "@/integrations/supabase/client";
import { ESGBenchmark, handleServiceError } from "./types/externalTypes";

class BenchmarkService {
  // Get industry benchmarks
  async getESGBenchmarks(
    industry?: string,
    category?: string
  ): Promise<ESGBenchmark[]> {
    try {
      let query = supabase
        .from('esg_benchmarks')
        .select('*');
        
      // Apply filters if provided
      if (industry) {
        query = query.eq('industry', industry);
      }
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as ESGBenchmark[];
    } catch (error) {
      handleServiceError(error, "Failed to load ESG benchmarks");
      return [];
    }
  }
}

export const benchmarkService = new BenchmarkService();
