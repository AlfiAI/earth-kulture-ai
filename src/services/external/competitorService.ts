
import { supabase } from "@/integrations/supabase/client";
import { ESGCompetitor, handleServiceError } from "./types/externalTypes";

class CompetitorService {
  // Get competitors data with improved error handling and validation
  async getESGCompetitors(industry?: string): Promise<ESGCompetitor[]> {
    try {
      // Build query
      let query = supabase
        .from('esg_competitors')
        .select('*');
        
      // Apply industry filter if provided
      if (industry) {
        query = query.eq('industry', industry);
      }
      
      const { data, error } = await query
        .order('esg_score', { ascending: false });
      
      if (error) throw error;
      
      // Validate response data
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid response format from ESG competitors query");
      }
      
      return data as ESGCompetitor[];
    } catch (error) {
      handleServiceError(error, "Failed to load ESG competitors data", {
        operation: 'getESGCompetitors',
        params: { industry }
      });
      return [];
    }
  }

  // Get competitor details by ID
  async getESGCompetitorById(id: string): Promise<ESGCompetitor | null> {
    try {
      if (!id) {
        throw new Error("Competitor ID is required");
      }
      
      const { data, error } = await supabase
        .from('esg_competitors')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as ESGCompetitor;
    } catch (error) {
      handleServiceError(error, "Failed to load ESG competitor details", {
        operation: 'getESGCompetitorById',
        params: { id }
      });
      return null;
    }
  }
}

export const competitorService = new CompetitorService();
