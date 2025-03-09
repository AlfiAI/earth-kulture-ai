
import { supabase } from "@/integrations/supabase/client";
import { ExternalESGDataset, handleServiceError } from "./types/externalTypes";
import { toast } from "sonner";

class DatasetsService {
  // Get external datasets with improved error handling and type safety
  async getExternalDatasets(category?: string): Promise<ExternalESGDataset[]> {
    try {
      // Build query
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
      
      // Validate response data
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid response format from external datasets query");
      }
      
      return data as ExternalESGDataset[];
    } catch (error) {
      handleServiceError(error, "Failed to load external ESG datasets", {
        operation: 'getExternalDatasets',
        params: { category }
      });
      return [];
    }
  }

  // Run the external datasets function with improved error handling
  async triggerExternalDatasetsFetch(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-external-datasets');
      
      if (error) throw error;
      
      // Validate response data
      if (!data || typeof data.count !== 'number') {
        throw new Error("Invalid response from external datasets function");
      }
      
      console.log("External datasets fetch result:", data);
      toast.success(`Successfully updated external ESG datasets: ${data.count} datasets`);
      
      return true;
    } catch (error) {
      handleServiceError(error, "Failed to update external ESG datasets", {
        operation: 'triggerExternalDatasetsFetch'
      });
      return false;
    }
  }

  // Format an ExternalESGDataset to a more UI-friendly format if needed
  formatDatasetForDisplay(dataset: ExternalESGDataset): FormattedESGDataset {
    const metadata = dataset.data?.metadata || {};
    
    return {
      id: dataset.id,
      name: dataset.dataset_name,
      description: dataset.dataset_description || '',
      provider: dataset.source,
      dataType: dataset.category,
      url: metadata.sourceUrl || '#',
      lastUpdated: dataset.last_updated || new Date().toISOString(),
      coverage: {
        regions: metadata.regions || [],
        industries: metadata.industries || [],
        years: metadata.years || []
      },
      format: metadata.format || 'JSON',
      accessType: metadata.accessType || 'public',
      tags: dataset.metrics || []
    };
  }
}

export const datasetsService = new DatasetsService();

// Added type definition for our formatter function
interface FormattedESGDataset {
  id: string;
  name: string;
  description: string;
  provider: string;
  dataType: string;
  url: string;
  lastUpdated: string;
  coverage: {
    regions: string[];
    industries?: string[];
    years?: number[];
  };
  format: string;
  accessType: 'public' | 'subscription' | 'restricted';
  tags: string[];
}
