
import { supabase } from "@/integrations/supabase/client";
import { aiAgentOrchestrator } from '../../orchestration/aiAgentOrchestrator';

/**
 * Service for monitoring compliance status
 */
class ComplianceMonitor {
  /**
   * Check compliance status for a user
   */
  async checkComplianceStatus(userId: string): Promise<void> {
    try {
      // Get latest compliance status
      const { data: complianceData, error } = await supabase
        .from('compliance_status')
        .select('*, compliance_frameworks(*)')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      // Send to regulatory agent for analysis
      await aiAgentOrchestrator.submitTask('regulatory-compliance', {
        complianceData,
        userId,
        action: 'analyze-compliance'
      }, 'high');
    } catch (error) {
      console.error('Error checking compliance status:', error);
    }
  }
  
  /**
   * Check for regulatory updates
   */
  async checkRegulatoryUpdates(userId: string): Promise<void> {
    try {
      // Get latest regulatory updates
      const { data: regulationsData, error } = await supabase
        .from('esg_regulatory_updates')
        .select('*')
        .order('published_date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Send to regulatory agent for analysis
      await aiAgentOrchestrator.submitTask('regulatory-compliance', {
        regulationsData,
        userId,
        action: 'analyze-regulatory-updates'
      }, 'medium');
    } catch (error) {
      console.error('Error checking regulatory updates:', error);
    }
  }
}

export const complianceMonitor = new ComplianceMonitor();
