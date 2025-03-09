
import { supabase } from "@/integrations/supabase/client";
import { ESGRegulation, handleServiceError, PaginatedResponse } from "./types/externalTypes";

class RegulationService {
  // Get ESG regulations with improved error handling and filtering options
  async getESGRegulations(
    page?: number,
    pageSize?: number,
    category?: string,
    impactLevel?: string,
    tags?: string[]
  ): Promise<PaginatedResponse<ESGRegulation>> {
    try {
      // Build query
      let query = supabase
        .from('esg_regulatory_updates')
        .select('*', { count: 'exact' });
        
      // Apply filters if provided
      if (category) {
        query = query.eq('category', category);
      }
      
      if (impactLevel) {
        query = query.eq('impact_level', impactLevel);
      }
      
      if (tags && tags.length > 0) {
        query = query.contains('tags', tags);
      }
      
      // Add pagination if provided
      if (page && pageSize) {
        const start = (page - 1) * pageSize;
        query = query.range(start, start + pageSize - 1);
      }
      
      const { data, error, count } = await query
        .order('published_date', { ascending: false });
      
      if (error) throw error;
      
      // Validate response data
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid response format from ESG regulations query");
      }
      
      // Break the type recursion by using a simpler type assertion
      return {
        data: data as any,
        count: count || 0
      };
    } catch (error) {
      handleServiceError(error, "Failed to load ESG regulations", {
        operation: 'getESGRegulations',
        params: { page, pageSize, category, impactLevel, tags }
      });
      return { data: [], count: 0 };
    }
  }

  // Get specific regulation by ID
  async getESGRegulationById(id: string): Promise<ESGRegulation | null> {
    try {
      if (!id) {
        throw new Error("Regulation ID is required");
      }
      
      const { data, error } = await supabase
        .from('esg_regulatory_updates')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Break the type recursion by using a simpler type assertion
      return data as unknown as ESGRegulation;
    } catch (error) {
      handleServiceError(error, "Failed to load ESG regulation details", {
        operation: 'getESGRegulationById',
        params: { id }
      });
      return null;
    }
  }

  // Get regulations affecting specific sectors
  async getRegulationsBySector(sector: string): Promise<ESGRegulation[]> {
    try {
      // Note: This assumes there's a 'tags' column that might contain sector information
      const { data, error } = await supabase
        .from('esg_regulatory_updates')
        .select('*')
        .contains('tags', [sector])
        .order('published_date', { ascending: false });
      
      if (error) throw error;
      
      // Break the type recursion by using a simpler type assertion
      return (data || []) as unknown as ESGRegulation[];
    } catch (error) {
      handleServiceError(error, "Failed to load sector-specific regulations", {
        operation: 'getRegulationsBySector',
        params: { sector }
      });
      return [];
    }
  }

  // Trigger ESG scraper to update regulations data
  async triggerESGScraper(): Promise<void> {
    try {
      await supabase.functions.invoke('esg-scraper');
      console.log('ESG scraper triggered successfully');
    } catch (error) {
      handleServiceError(error, "Failed to trigger ESG scraper", {
        operation: 'triggerESGScraper'
      });
    }
  }
}

export const regulationService = new RegulationService();
