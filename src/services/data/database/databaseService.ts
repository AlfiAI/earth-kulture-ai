
import { supabase } from "@/integrations/supabase/client";
import { ESGDataPoint } from '../../types/esgTypes';
import { toast } from "sonner";

export class DatabaseService {
  // Map string category to valid enum value
  mapCategoryToEnum(category: string): "environmental" | "social" | "governance" {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory === "social") return "social";
    if (lowerCategory === "governance") return "governance";
    
    // Default to environmental for any other value
    return "environmental";
  }

  // Fetch ESG data from Supabase with pagination
  async fetchFromSupabase(page: number, pageSize: number): Promise<{
    data: ESGDataPoint[];
    count: number;
  }> {
    // Calculate the range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Get both the data and the count in a single call
    const { data, error, count } = await supabase
      .from('esg_data')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('date', { ascending: false });
      
    if (error) throw error;
    
    // Transform data to match our format with proper typing
    const formattedData: ESGDataPoint[] = (data || []).map(item => ({
      id: item.id,
      category: this.mapCategoryToEnum(item.category),
      subCategory: item.metric_name, // Using metric_name as subCategory
      value: item.value,
      unit: item.unit || '',
      source: item.metric_name,
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      verified: false
    }));
    
    return { 
      data: formattedData, 
      count: count || 0 
    };
  }

  // Process data with Supabase insertion
  async processWithSupabase(dataPoint: Partial<ESGDataPoint>): Promise<ESGDataPoint> {
    // Get current user ID
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    // Ensure the category is valid
    const validCategory = this.mapCategoryToEnum(dataPoint.category || 'environmental');
    
    // Prepare data for insertion
    const insertData = {
      user_id: userData.user.id,
      category: validCategory,
      metric_name: dataPoint.subCategory || 'other',
      value: dataPoint.value,
      unit: dataPoint.unit,
      date: dataPoint.date ? new Date(dataPoint.date).toISOString() : new Date().toISOString(),
      notes: ''
    };
    
    // Insert data into Supabase
    const { data, error } = await supabase
      .from('esg_data')
      .insert(insertData)
      .select()
      .single();
      
    if (error) {
      console.error("Supabase insertion error:", error);
      throw error;
    }
    
    // Transform to ESGDataPoint format
    return {
      id: data.id,
      category: this.mapCategoryToEnum(data.category),
      subCategory: data.metric_name,
      value: data.value,
      unit: data.unit || '',
      source: data.metric_name,
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
      verified: false
    };
  }
}

export const databaseService = new DatabaseService();
