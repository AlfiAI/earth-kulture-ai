
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AlertSeverity, AlertType, ESGAlert, ESGAlertDB } from "../types/alertTypes";
import { castParam, executeSupabaseQuery } from "@/utils/supabaseHelpers";

/**
 * Service for handling ESG alerts
 */
class AlertService {
  /**
   * Create an ESG alert
   */
  async createAlert(alert: Omit<ESGAlert, 'timestamp' | 'isRead'>): Promise<string | null> {
    try {
      const result = await executeSupabaseQuery(async () => {
        return await supabase
          .from('esg_compliance_alerts')
          .insert({
            user_id: castParam(alert.userId),
            message: alert.title,
            alert_type: castParam(alert.type),
            severity: castParam(alert.severity),
            compliance_framework: castParam(alert.category),
            source_data: alert.relatedData || null,
            resolution_steps: alert.recommendedActions || null,
            status: 'active'
          })
          .select('id')
          .single();
      });
      
      if (!result.success || !result.data) {
        // Check if result is not successful or data is not available
        const errorMessage = result.success ? 'No data returned' : result.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      
      if (alert.severity === 'critical' || alert.severity === 'high') {
        toast.error(`${alert.title}`, {
          description: alert.description,
          action: {
            label: "View",
            onClick: () => console.log('View alert', result.data.id)
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
      
      return result.data.id;
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
      const result = await executeSupabaseQuery(async () => {
        let query = supabase
          .from('esg_compliance_alerts')
          .select('*')
          .eq('user_id', castParam(userId))
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (onlyUnread) {
          query = query.eq('status', castParam('active'));
        }
        
        return await query;
      });
      
      if (!result.success || !result.data) {
        return [];
      }
      
      // Transform database response to ESGAlert format
      return result.data.map((item: any) => {
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
          severity: item.severity as AlertSeverity,
          type: item.alert_type as AlertType,
          source: item.compliance_framework || 'system',
          category: item.compliance_framework || 'general',
          timestamp: new Date(item.created_at).toISOString(),
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
      const result = await executeSupabaseQuery(async () => {
        return await supabase
          .from('esg_compliance_alerts')
          .update({ 
            status: castParam('resolved') 
          })
          .eq('id', castParam(alertId));
      });
      
      return result.success;
    } catch (error) {
      console.error('Error marking alert as read:', error);
      return false;
    }
  }
}

export const alertService = new AlertService();
