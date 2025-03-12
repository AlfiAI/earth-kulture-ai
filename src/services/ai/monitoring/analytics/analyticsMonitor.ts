
import { supabase } from "@/integrations/supabase/client";
import { aiAgentOrchestrator } from '../../orchestration';
import { TaskPriority } from '../../orchestration/types/agentTypes';

/**
 * Service for monitoring analytics and performance trends
 */
class AnalyticsMonitor {
  /**
   * Analyze performance trends for a user
   */
  async analyzePerformanceTrends(userId: string): Promise<void> {
    try {
      // Get ESG data for trend analysis
      const { data: esgData, error } = await supabase
        .from('esg_data')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      // Send to predictive agent for analysis
      await aiAgentOrchestrator.submitTask('predictive-analytics', {
        esgData,
        userId,
        action: 'analyze-trends'
      }, TaskPriority.LOW);
    } catch (error) {
      console.error('Error analyzing performance trends:', error);
    }
  }
}

export const analyticsMonitor = new AnalyticsMonitor();
