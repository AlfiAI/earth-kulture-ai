
import { supabase } from "@/integrations/supabase/client";
import { ExternalESGDataset, handleServiceError } from "./types/externalTypes";
import { toast } from "sonner";

class DatasetsService {
  // Get external datasets
  async getExternalDatasets(category?: string): Promise<ExternalESGDataset[]> {
    try {
      let query = supabase
        .from('external_esg_datasets')
        .select('*');
        
      // Apply category filter if provided
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query
        .order('last_updated', { ascending: false });
      
      if (error) throw error;
      
      return data as ExternalESGDataset[];
    } catch (error) {
      handleServiceError(error, "Failed to load external ESG datasets");
      return [];
    }
  }

  // Run the external datasets function
  async triggerExternalDatasetsFetch(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-external-datasets');
      
      if (error) throw error;
      
      console.log("External datasets fetch result:", data);
      toast.success(`Successfully updated external ESG datasets: ${data.count} datasets`);
      
      return true;
    } catch (error) {
      handleServiceError(error, "Failed to update external ESG datasets");
      return false;
    }
  }
}

export const datasetsService = new DatasetsService();
