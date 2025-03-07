
import { ComplianceFramework } from '../types/esgTypes';
import { supabase } from "@/integrations/supabase/client";
import { complianceFrameworks } from '../data/sampleEsgData';

class ComplianceService {
  // Get compliance frameworks
  async getComplianceFrameworks(): Promise<ComplianceFramework[]> {
    try {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('compliance_frameworks')
        .select('*')
        .order('name');
        
      if (error) {
        console.error("Error fetching compliance frameworks:", error);
        return this.getFallbackComplianceData();
      }
      
      if (!data || data.length === 0) {
        return this.getFallbackComplianceData();
      }
      
      // Transform data to match our ComplianceFramework interface
      return data.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description || '',
        region: item.region || 'Global'
      }));
    } catch (error) {
      console.error("Error in getComplianceFrameworks:", error);
      return this.getFallbackComplianceData();
    }
  }
  
  // Get user's compliance status
  async getUserComplianceStatus(frameworkId: string): Promise<string> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        return 'Not Started';
      }
      
      const { data, error } = await supabase
        .from('compliance_status')
        .select('status')
        .eq('user_id', user.user.id)
        .eq('framework_id', frameworkId)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching compliance status:", error);
        return 'Not Started';
      }
      
      return data?.status || 'Not Started';
    } catch (error) {
      console.error("Error in getUserComplianceStatus:", error);
      return 'Not Started';
    }
  }
  
  // Private method to get fallback data for demo purposes
  private getFallbackComplianceData(): Promise<ComplianceFramework[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(complianceFrameworks);
      }, 500);
    });
  }
}

export const complianceService = new ComplianceService();
