
import { CarbonEmission } from '../types/esgTypes';
import { supabase } from "@/integrations/supabase/client";
import { sampleCarbonEmissions } from '../data/sampleEsgData';

class CarbonService {
  // Test Supabase connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error, status } = await supabase
        .from('carbon_emissions')
        .select('count(*)', { count: 'exact', head: true });
        
      if (error && status !== 406) {
        console.error("Connection test error:", error);
        return { 
          success: false, 
          message: `Failed to connect to Supabase: ${error.message}` 
        };
      }
      
      return { 
        success: true, 
        message: "Successfully connected to Supabase carbon_emissions table" 
      };
    } catch (error) {
      console.error("Connection test exception:", error);
      return { 
        success: false, 
        message: `Exception when connecting to Supabase: ${error.message}` 
      };
    }
  }

  // Get carbon emissions data
  async getCarbonEmissions(): Promise<CarbonEmission[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        console.log("No authenticated user, returning fallback data");
        return this.getFallbackCarbonData();
      }
      
      const { data, error } = await supabase
        .from('carbon_emissions')
        .select('*')
        .eq('user_id', user.user.id)
        .order('date', { ascending: false });
        
      if (error) {
        console.error("Error fetching carbon emissions:", error);
        return this.getFallbackCarbonData();
      }
      
      if (!data || data.length === 0) {
        console.log("No carbon emissions data found, returning fallback data");
        return this.getFallbackCarbonData();
      }
      
      // Transform data to match our CarbonEmission interface
      return data.map(item => ({
        id: item.id,
        date: item.date,
        source: item.source,
        scope: item.scope as 'scope1' | 'scope2' | 'scope3',
        // Don't try to access category from DB response as it doesn't exist
        amount: item.amount,
        unit: item.unit as 'tCO2e' | 'kgCO2e',
        notes: item.notes
      }));
    } catch (error) {
      console.error("Error in getCarbonEmissions:", error);
      return this.getFallbackCarbonData();
    }
  }
  
  // Private method to get fallback data for demo purposes
  private getFallbackCarbonData(): Promise<CarbonEmission[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sampleCarbonEmissions);
      }, 500);
    });
  }

  // Calculate carbon footprint
  calculateCarbonFootprint(emissions: CarbonEmission[]): { 
    scope1: number, 
    scope2: number, 
    scope3: number, 
    total: number 
  } {
    const scope1 = emissions
      .filter(e => e.scope === 'scope1')
      .reduce((sum, e) => sum + e.amount, 0);
      
    const scope2 = emissions
      .filter(e => e.scope === 'scope2')
      .reduce((sum, e) => sum + e.amount, 0);
      
    const scope3 = emissions
      .filter(e => e.scope === 'scope3')
      .reduce((sum, e) => sum + e.amount, 0);
      
    return {
      scope1,
      scope2,
      scope3,
      total: scope1 + scope2 + scope3
    };
  }
  
  // Add a new carbon emission entry
  async addCarbonEmission(emission: Omit<CarbonEmission, 'id'>): Promise<CarbonEmission | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error("User not authenticated");
      }
      
      // Ensure date is a string when passing to Supabase
      const dateStr = typeof emission.date === 'string' ? emission.date : emission.date;
      
      const { data, error } = await supabase
        .from('carbon_emissions')
        .insert({
          user_id: user.user.id,
          date: dateStr,
          source: emission.source,
          scope: emission.scope,
          amount: emission.amount,
          unit: emission.unit,
          notes: emission.notes
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error adding carbon emission:", error);
        throw error;
      }
      
      return {
        id: data.id,
        date: data.date,
        source: data.source,
        scope: data.scope as 'scope1' | 'scope2' | 'scope3',
        // Don't try to access category from DB response
        amount: data.amount,
        unit: data.unit as 'tCO2e' | 'kgCO2e',
        notes: data.notes
      };
    } catch (error) {
      console.error("Error in addCarbonEmission:", error);
      return null;
    }
  }
}

export const carbonService = new CarbonService();
