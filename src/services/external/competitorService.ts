
import { supabase } from "@/integrations/supabase/client";
import { ESGCompetitor, handleServiceError } from "./types/externalTypes";

class CompetitorService {
  // Get competitors data
  async getESGCompetitors(industry?: string): Promise<ESGCompetitor[]> {
    try {
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
      
      return data as ESGCompetitor[];
    } catch (error) {
      handleServiceError(error, "Failed to load ESG competitors data");
      return [];
    }
  }
}

export const competitorService = new CompetitorService();
