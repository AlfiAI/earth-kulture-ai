
import { supabase } from "@/integrations/supabase/client";
import { ESGRegulation, PaginatedResponse, handleServiceError } from "./types/externalTypes";
import { toast } from "sonner";

class RegulationsService {
  // Get ESG regulatory updates with pagination
  async getESGRegulations(
    page = 1, 
    pageSize = 10, 
    category?: string
  ): Promise<PaginatedResponse<ESGRegulation>> {
    try {
      let query = supabase
        .from('esg_regulatory_updates')
        .select('*', { count: 'exact' });
      
      // Apply category filter if provided
      if (category) {
        query = query.eq('category', category);
      }
      
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .order('published_date', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      return { 
        data: data as ESGRegulation[], 
        count: count || 0 
      };
    } catch (error) {
      handleServiceError(error, "Failed to load ESG regulatory updates");
      return { data: [], count: 0 };
    }
  }

  // Run the ESG scraper function
  async triggerESGScraper(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('esg-scraper');
      
      if (error) throw error;
      
      console.log("ESG scraper result:", data);
      toast.success(`Successfully updated ESG regulatory data: ${data.count} items`);
      
      return true;
    } catch (error) {
      handleServiceError(error, "Failed to update ESG regulatory data");
      return false;
    }
  }
}

export const regulationsService = new RegulationsService();
