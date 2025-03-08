
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface ExternalESGDataset {
  id: string;
  source: string;
  dataset_name: string;
  dataset_description?: string;
  data: any;
  category: string;
  last_updated: string;
  next_update?: string;
  metrics?: string[];
}

export interface ESGRegulation {
  id: string;
  source: string;
  title: string;
  content: string;
  url: string;
  category: string;
  country?: string;
  published_date?: string;
  impact_level?: string;
  scraped_at: string;
  relevance_score?: number;
  tags?: string[];
}

export interface ESGBenchmark {
  id: string;
  industry: string;
  benchmark_name: string;
  benchmark_value: number;
  unit?: string;
  source: string;
  year?: number;
  region?: string;
  category: string;
  created_at: string;
}

export interface ESGCompetitor {
  id: string;
  company_name: string;
  industry: string;
  esg_score?: number;
  environmental_score?: number;
  social_score?: number;
  governance_score?: number;
  report_url?: string;
  report_year?: number;
  highlights?: string[];
  created_at: string;
  last_updated: string;
}

class ExternalDataService {
  // Get ESG regulatory updates with pagination
  async getESGRegulations(
    page = 1, 
    pageSize = 10, 
    category?: string
  ): Promise<{ 
    data: ESGRegulation[]; 
    count: number; 
  }> {
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
      console.error("Error fetching ESG regulations:", error);
      toast.error("Failed to load ESG regulatory updates");
      return { data: [], count: 0 };
    }
  }

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
      console.error("Error fetching external datasets:", error);
      toast.error("Failed to load external ESG datasets");
      return [];
    }
  }

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
      console.error("Error fetching ESG benchmarks:", error);
      toast.error("Failed to load ESG benchmarks");
      return [];
    }
  }

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
      console.error("Error fetching ESG competitors:", error);
      toast.error("Failed to load ESG competitors data");
      return [];
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
      console.error("Error triggering ESG scraper:", error);
      toast.error("Failed to update ESG regulatory data");
      return false;
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
      console.error("Error triggering external datasets fetch:", error);
      toast.error("Failed to update external ESG datasets");
      return false;
    }
  }
}

export const externalDataService = new ExternalDataService();
