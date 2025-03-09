
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { deepseekR1Service } from '../deepseekR1Service';
import { aiAgentOrchestrator } from '../orchestration/aiAgentOrchestrator';
import { Json } from "@/integrations/supabase/types";

// Alert severity levels
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Alert types
export type AlertType = 'compliance' | 'risk' | 'opportunity' | 'trend' | 'recommendation';

// Alert interface
export interface ESGAlert {
  id?: string;
  userId: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  type: AlertType;
  source: string;
  category: string;
  createdAt: Date;
  isRead: boolean;
  relatedData?: any;
  recommendedActions?: string[];
}

// Database interface for the alerts table
// Make sure this matches the exact structure from the database
interface ESGAlertDB {
  id: string;
  user_id: string;
  message: string;
  severity: string; // Changed from AlertSeverity to string to match DB
  alert_type: string; // Changed from AlertType to string to match DB
  compliance_framework?: string;
  source_data?: Json;
  created_at: string;
  status: string;
  resolution_steps?: string[] | Json;
  resolved_at?: string;
}

/**
 * ESG Monitoring Service - Provides real-time monitoring and alerts
 */
class ESGMonitoringService {
  // Interval ID for background monitoring
  private monitoringInterval: number | null = null;
  // Flag to prevent concurrent monitoring operations
  private isMonitoring: boolean = false;
  
  /**
   * Start automated ESG monitoring
   * @param intervalMinutes How often to run monitoring checks (in minutes)
   */
  startAutomatedMonitoring(intervalMinutes: number = 60): void {
    // Clear any existing interval
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    // Convert minutes to milliseconds
    const intervalMs = intervalMinutes * 60 * 1000;
    
    // Start immediate check
    this.runMonitoringCheck();
    
    // Set up regular interval
    this.monitoringInterval = window.setInterval(() => {
      this.runMonitoringCheck();
    }, intervalMs);
    
    console.log(`Automated ESG monitoring started (interval: ${intervalMinutes} minutes)`);
  }
  
  /**
   * Stop automated ESG monitoring
   */
  stopAutomatedMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('Automated ESG monitoring stopped');
    }
  }
  
  /**
   * Run a comprehensive monitoring check
   */
  async runMonitoringCheck(): Promise<void> {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('Running ESG monitoring check...');
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      // Run monitoring checks in parallel
      await Promise.all([
        this.checkComplianceStatus(userId),
        this.checkRegulatoryUpdates(userId),
        this.analyzePerformanceTrends(userId)
      ]);
      
      console.log('ESG monitoring check completed');
    } catch (error) {
      console.error('Error during ESG monitoring check:', error);
    } finally {
      this.isMonitoring = false;
    }
  }
  
  /**
   * Check compliance status
   */
  private async checkComplianceStatus(userId: string): Promise<void> {
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
  private async checkRegulatoryUpdates(userId: string): Promise<void> {
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
  
  /**
   * Analyze performance trends
   */
  private async analyzePerformanceTrends(userId: string): Promise<void> {
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
      }, 'low');
    } catch (error) {
      console.error('Error analyzing performance trends:', error);
    }
  }
  
  /**
   * Create an ESG alert
   */
  async createAlert(alert: Omit<ESGAlert, 'createdAt' | 'isRead'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('esg_compliance_alerts')
        .insert({
          user_id: alert.userId,
          message: alert.title,
          alert_type: alert.type,
          severity: alert.severity,
          compliance_framework: alert.category,
          source_data: alert.relatedData || null,
          resolution_steps: alert.recommendedActions || null
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      if (alert.severity === 'critical' || alert.severity === 'high') {
        toast.error(`${alert.title}`, {
          description: alert.description,
          action: {
            label: "View",
            onClick: () => console.log('View alert', data.id)
          },
        });
      } else if (alert.severity === 'medium') {
        toast.warning(`${alert.title}`, {
          description: alert.description
        });
      } else {
        toast.info(`${alert.title}`, {
          description: alert.description
        });
      }
      
      return data.id;
    } catch (error) {
      console.error('Error creating ESG alert:', error);
      return null;
    }
  }
  
  /**
   * Get alerts for a user
   */
  async getAlerts(userId: string, limit: number = 20, onlyUnread: boolean = false): Promise<ESGAlert[]> {
    try {
      let query = supabase
        .from('esg_compliance_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (onlyUnread) {
        query = query.eq('status', 'active');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (!data) return [];
      
      // Transform database response to ESGAlert format
      // Using a type assertion to handle the mapping correctly
      return data.map((item: any) => {
        // Convert resolution_steps from Json to string[] if needed
        let recommendedActions: string[] | undefined;
        
        if (item.resolution_steps) {
          if (Array.isArray(item.resolution_steps)) {
            recommendedActions = item.resolution_steps as string[];
          } else if (typeof item.resolution_steps === 'string') {
            try {
              const parsed = JSON.parse(item.resolution_steps);
              recommendedActions = Array.isArray(parsed) ? parsed : [item.resolution_steps as string];
            } catch {
              recommendedActions = [item.resolution_steps as string];
            }
          }
        }
        
        return {
          id: item.id,
          userId: item.user_id,
          title: item.message,
          description: item.message,
          // Explicitly cast to AlertSeverity and AlertType to ensure type safety
          severity: item.severity as AlertSeverity,
          type: item.alert_type as AlertType,
          source: item.compliance_framework || 'system',
          category: item.compliance_framework || 'general',
          createdAt: new Date(item.created_at),
          isRead: item.status === 'resolved',
          relatedData: item.source_data,
          recommendedActions
        };
      });
    } catch (error) {
      console.error('Error getting ESG alerts:', error);
      return [];
    }
  }
  
  /**
   * Mark an alert as read
   */
  async markAlertAsRead(alertId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('esg_compliance_alerts')
        .update({ status: 'resolved' })
        .eq('id', alertId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error marking alert as read:', error);
      return false;
    }
  }
}

export const esgMonitoringService = new ESGMonitoringService();
