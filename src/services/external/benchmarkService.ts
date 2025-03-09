
import { supabase } from "@/integrations/supabase/client";
import { ESGBenchmark } from "./types/externalTypes";
import { handleServiceError } from "./types/serviceUtils";

class BenchmarkService {
  // Get industry benchmarks with improved error handling and validation
  async getESGBenchmarks(
    industry?: string,
    category?: string
  ): Promise<ESGBenchmark[]> {
    try {
      // Build query
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
      
      // Validate response data
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid response format from ESG benchmarks query");
      }
      
      return data as ESGBenchmark[];
    } catch (error) {
      handleServiceError(error, "Failed to load ESG benchmarks", {
        operation: 'getESGBenchmarks',
        params: { industry, category }
      });
      return [];
    }
  }

  // Get specific benchmark by ID
  async getESGBenchmarkById(id: string): Promise<ESGBenchmark | null> {
    try {
      if (!id) {
        throw new Error("Benchmark ID is required");
      }
      
      const { data, error } = await supabase
        .from('esg_benchmarks')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as ESGBenchmark;
    } catch (error) {
      handleServiceError(error, "Failed to load ESG benchmark details", {
        operation: 'getESGBenchmarkById',
        params: { id }
      });
      return null;
    }
  }
}

export const benchmarkService = new BenchmarkService();
