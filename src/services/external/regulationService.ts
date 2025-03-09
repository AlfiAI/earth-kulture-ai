
import { supabase } from "@/integrations/supabase/client";
import { ESGRegulation, handleServiceError } from "./types/externalTypes";

class RegulationService {
  // Get ESG regulations with improved error handling and filtering options
  async getESGRegulations(
    region?: string,
    status?: 'upcoming' | 'active' | 'superseded'
  ): Promise<ESGRegulation[]> {
    try {
      // Build query
      let query = supabase
        .from('esg_regulatory_updates')
        .select('*');
        
      // Apply filters if provided
      if (region) {
        query = query.eq('country', region);
      }
      
      // Note: status field might need adjustment if the database uses a different field
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query
        .order('published_date', { ascending: false });
      
      if (error) throw error;
      
      // Validate response data
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid response format from ESG regulations query");
      }
      
      // Cast to ESGRegulation[] - using a simpler type assertion
      return data as any as ESGRegulation[];
    } catch (error) {
      handleServiceError(error, "Failed to load ESG regulations", {
        operation: 'getESGRegulations',
        params: { region, status }
      });
      return [];
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
      
      // Cast to ESGRegulation - using a simpler type assertion
      return data as any as ESGRegulation;
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
      
      // Cast to ESGRegulation[] - using a simpler type assertion
      return (data || []) as any as ESGRegulation[];
    } catch (error) {
      handleServiceError(error, "Failed to load sector-specific regulations", {
        operation: 'getRegulationsBySector',
        params: { sector }
      });
      return [];
    }
  }
}

export const regulationService = new RegulationService();
