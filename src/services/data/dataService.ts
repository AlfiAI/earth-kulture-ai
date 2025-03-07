
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ESGDataPoint } from '../types/esgTypes';

class DataService {
  // Fetch ESG data points
  async fetchESGData(): Promise<ESGDataPoint[]> {
    try {
      // For now, we'll use the mock data service
      // In a real implementation, this would fetch from Supabase
      const { esgDataCoreService } = await import('../core/esgDataService');
      return await esgDataCoreService.getAllESGData();
      
      // When you have an actual table in Supabase, you would use:
      /*
      const { data, error } = await supabase
        .from('esg_data')
        .select('*');
        
      if (error) throw error;
      return data || [];
      */
    } catch (error) {
      console.error("Error fetching ESG data:", error);
      toast.error("Failed to load ESG data");
      return [];
    }
  }

  // Process a data point
  async processDataPoint(dataPoint: Partial<ESGDataPoint>): Promise<ESGDataPoint | null> {
    try {
      // For now, we'll use the mock data service
      // In a real implementation, this would process with Supabase
      const { esgDataCoreService } = await import('../core/esgDataService');
      return await esgDataCoreService.processESGData(dataPoint);
      
      // When you have an actual table in Supabase, you would use:
      /*
      // First process and validate data
      const processedData = {
        ...dataPoint,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        created_at: new Date().toISOString()
      };
      
      // Then insert into the database
      const { data, error } = await supabase
        .from('esg_data')
        .insert(processedData)
        .select()
        .single();
        
      if (error) throw error;
      return data;
      */
    } catch (error) {
      console.error("Error processing data point:", error);
      toast.error("Failed to process data");
      return null;
    }
  }
}

export const dataService = new DataService();
