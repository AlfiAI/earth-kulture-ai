
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ResolutionStep {
  step: string;
  description: string;
  completed?: boolean;
}

export interface ComplianceAlert {
  id: string;
  alertType: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  createdAt: string;
  status: 'active' | 'resolved' | 'ignored';
  framework?: string;
  resolutionSteps?: ResolutionStep[];
  resolvedAt?: string;
}

class ComplianceAlertService {
  /**
   * Get compliance alerts for the current user
   */
  async getAlerts(): Promise<ComplianceAlert[]> {
    try {
      const { data, error } = await supabase
        .from('esg_compliance_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(alert => {
        const resolutionSteps: ResolutionStep[] = Array.isArray(alert.resolution_steps) 
          ? alert.resolution_steps 
          : [];
          
        return {
          id: alert.id,
          alertType: alert.alert_type,
          severity: alert.severity as 'high' | 'medium' | 'low',
          message: alert.message,
          createdAt: new Date(alert.created_at).toISOString(),
          status: alert.status as 'active' | 'resolved' | 'ignored',
          framework: alert.compliance_framework,
          resolutionSteps: resolutionSteps,
          resolvedAt: alert.resolved_at ? new Date(alert.resolved_at).toISOString() : undefined,
        };
      });
    } catch (error) {
      console.error('Error fetching compliance alerts:', error);
      toast.error('Failed to load compliance alerts');
      return [];
    }
  }

  /**
   * Update the status of an alert
   */
  async updateAlertStatus(alertId: string, status: 'active' | 'resolved' | 'ignored'): Promise<boolean> {
    try {
      const updateData: any = {
        status
      };

      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('esg_compliance_alerts')
        .update(updateData)
        .eq('id', alertId);

      if (error) {
        throw error;
      }

      toast.success(`Alert ${status === 'resolved' ? 'resolved' : 'updated'} successfully`);
      return true;
    } catch (error) {
      console.error('Error updating alert status:', error);
      toast.error('Failed to update alert status');
      return false;
    }
  }

  /**
   * Update resolution steps for an alert
   */
  async updateResolutionSteps(alertId: string, steps: ResolutionStep[]): Promise<boolean> {
    try {
      // Convert to appropriate format for database
      const stepsForDb = steps.map(step => ({
        step: step.step,
        description: step.description,
        completed: step.completed || false
      }));

      const { error } = await supabase
        .from('esg_compliance_alerts')
        .update({
          resolution_steps: stepsForDb
        })
        .eq('id', alertId);

      if (error) {
        throw error;
      }

      toast.success('Resolution steps updated');
      return true;
    } catch (error) {
      console.error('Error updating resolution steps:', error);
      toast.error('Failed to update resolution steps');
      return false;
    }
  }
}

export const complianceAlertService = new ComplianceAlertService();
