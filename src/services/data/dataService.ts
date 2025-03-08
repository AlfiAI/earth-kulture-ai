
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ESGDataPoint } from '../types/esgTypes';
import { redisCache } from "../cache/redisCache";

class DataService {
  // Cache for storing fetched data
  private cache: {
    esgData?: {
      data: ESGDataPoint[];
      timestamp: number;
    }
  } = {};

  // Cache TTL in milliseconds (5 minutes)
  private CACHE_TTL = 5 * 60 * 1000;

  // Fetch ESG data points with pagination
  async fetchESGData(page = 1, pageSize = 20, useCache = true): Promise<{
    data: ESGDataPoint[];
    count: number;
  }> {
    try {
      // First check Redis cache
      const cacheKey = `esg_data_page_${page}_size_${pageSize}`;
      const cachedData = await redisCache.get<{data: ESGDataPoint[], count: number}>(cacheKey);
      
      if (useCache && cachedData) {
        console.log("Using Redis cached ESG data");
        return cachedData;
      }
      
      // Check in-memory cache if enabled and Redis cache miss
      if (useCache && this.cache.esgData && (Date.now() - this.cache.esgData.timestamp < this.CACHE_TTL)) {
        console.log("Using in-memory cached ESG data");
        
        // Apply pagination to cached data
        const startIndex = (page - 1) * pageSize;
        const paginatedData = this.cache.esgData.data.slice(startIndex, startIndex + pageSize);
        
        return {
          data: paginatedData,
          count: this.cache.esgData.data.length
        };
      }
      
      // For development/testing, use mock data service first
      // In a real implementation, this would be removed
      try {
        const { data, count } = await this.fetchFromSupabase(page, pageSize);
        
        // Cache results in Redis
        await redisCache.set(cacheKey, { data, count }, 300); // Cache for 5 minutes
        
        return { data, count };
      } catch (error) {
        console.log("Falling back to mock data service");
        const { esgDataCoreService } = await import('../core/esgDataService');
        const mockData = await esgDataCoreService.getAllESGData();
        
        // Cache the data
        this.cache.esgData = {
          data: mockData,
          timestamp: Date.now()
        };
        
        // Apply pagination
        const startIndex = (page - 1) * pageSize;
        const paginatedData = mockData.slice(startIndex, startIndex + pageSize);
        
        return {
          data: paginatedData,
          count: mockData.length
        };
      }
    } catch (error) {
      console.error("Error fetching ESG data:", error);
      toast.error("Failed to load ESG data");
      return { data: [], count: 0 };
    }
  }

  // Fetch from Supabase with pagination
  private async fetchFromSupabase(page: number, pageSize: number): Promise<{
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
    
    // Transform data to match our format
    const formattedData: ESGDataPoint[] = (data || []).map(item => ({
      id: item.id,
      category: this.mapCategoryToEnum(item.category), // Map to valid enum value
      subCategory: item.metric_name, // Using metric_name as subCategory
      value: item.value,
      unit: item.unit || '',
      source: item.metric_name,
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      verified: false
    }));
    
    // Update cache with all fetched data
    if (page === 1) { // Only cache on first page load
      this.cache.esgData = {
        data: formattedData,
        timestamp: Date.now()
      };
    }
    
    return { 
      data: formattedData, 
      count: count || 0 
    };
  }

  // Process a data point with optimized database insertion
  async processDataPoint(dataPoint: Partial<ESGDataPoint>): Promise<ESGDataPoint | null> {
    try {
      // For development, we'll use the mock service first
      // In a real implementation, this would be removed
      try {
        return await this.processWithSupabase(dataPoint);
      } catch (error) {
        console.log("Falling back to mock data service for processing");
        const { esgDataCoreService } = await import('../core/esgDataService');
        return await esgDataCoreService.processESGData(dataPoint);
      }
    } catch (error) {
      console.error("Error processing data point:", error);
      toast.error("Failed to process data");
      return null;
    }
  }

  // Process with Supabase insertion
  private async processWithSupabase(dataPoint: Partial<ESGDataPoint>): Promise<ESGDataPoint> {
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
    
    // Clear cache to ensure fresh data on next fetch
    this.cache = {};
    
    // Also clear Redis cache keys related to ESG data
    await this.clearRedisCache();
    
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

  // Helper method to map string category to valid enum value
  private mapCategoryToEnum(category: string): "environmental" | "social" | "governance" {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory === "social") return "social";
    if (lowerCategory === "governance") return "governance";
    
    // Default to environmental for any other value
    return "environmental";
  }

  // Clear Redis cache for ESG data
  private async clearRedisCache(): Promise<void> {
    const keys = await redisCache.keys();
    const esgKeys = keys.filter(key => key.startsWith('esg_data_'));
    
    for (const key of esgKeys) {
      await redisCache.delete(key);
    }
  }

  // Clear cache to force fresh data fetch
  clearCache(): void {
    this.cache = {};
    this.clearRedisCache();
    console.log("Cache cleared");
  }
}

export const dataService = new DataService();
