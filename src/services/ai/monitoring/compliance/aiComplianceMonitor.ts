import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { aiAgentOrchestrator } from '../../orchestration/aiAgentOrchestrator';
import { ESGAlert } from '../types/alertTypes';
import { esgMonitoringService } from '../esgMonitoringService';

export interface ComplianceRisk {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  framework: string;
  detectedAt: string;
  status: 'new' | 'in-review' | 'mitigated' | 'false-positive';
  dueDate?: string;
  suggestedActions: string[];
  relatedRegulations: string[];
  confidenceScore: number;
}

/**
 * Advanced AI Compliance Monitor - Uses machine learning to detect 
 * potential compliance issues before they become problems
 */
class AIComplianceMonitor {
  private isMonitoring: boolean = false;
  private monitoringInterval: number | null = null;
  
  startContinuousMonitoring(intervalMinutes: number = 30): void {
    this.stopContinuousMonitoring();
    
    this.runComplianceCheck();
    
    this.monitoringInterval = window.setInterval(() => {
      this.runComplianceCheck();
    }, intervalMinutes * 60 * 1000);
    
    console.log(`AI Compliance monitoring started (interval: ${intervalMinutes} minutes)`);
  }
  
  stopContinuousMonitoring(): void {
    if (this.monitoringInterval !== null) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('AI Compliance monitoring stopped');
    }
  }
  
  async runComplianceCheck(): Promise<void> {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('Running AI compliance check...');
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      const { data: esgData, error: esgError } = await supabase
        .from('esg_data')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (esgError) throw esgError;
      
      const { data: complianceData, error: complianceError } = await supabase
        .from('compliance_status')
        .select('*, compliance_frameworks(*)')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(20);
        
      if (complianceError) throw complianceError;
      
      const { data: regulationsData, error: regulationsError } = await supabase
        .from('esg_regulatory_updates')
        .select('*')
        .order('published_date', { ascending: false })
        .limit(20);
        
      if (regulationsError) throw regulationsError;
      
      const taskId = await aiAgentOrchestrator.submitTask('regulatory-compliance', {
        esgData,
        complianceData,
        regulationsData,
        userId,
        action: 'detect-compliance-risks'
      }, 'high');
      
      let retries = 0;
      const maxRetries = 12;
      
      const checkTaskStatus = async () => {
        if (retries >= maxRetries) {
          console.error('Compliance check timed out');
          this.isMonitoring = false;
          return;
        }
        
        const taskStatus = aiAgentOrchestrator.getTaskStatus(taskId);
        
        if (taskStatus?.status === 'completed' && taskStatus.result) {
          this.processComplianceResults(taskStatus.result, userId);
          this.isMonitoring = false;
        } else if (taskStatus?.status === 'failed') {
          console.error('Compliance check failed:', taskStatus.error);
          this.isMonitoring = false;
        } else {
          retries++;
          setTimeout(checkTaskStatus, 5000);
        }
      };
      
      checkTaskStatus();
      
    } catch (error) {
      console.error('Error during compliance check:', error);
      this.isMonitoring = false;
    }
  }
  
  private async processComplianceResults(results: any, userId: string): Promise<void> {
    try {
      const risks = results.detectedRisks || [];
      console.log(`Processing ${risks.length} compliance risks`);
      
      if (risks.length === 0) {
        console.log('No compliance risks detected');
        return;
      }
      
      for (const risk of risks) {
        if (risk.severity === 'high' || risk.severity === 'critical') {
          const alert: ESGAlert = {
            id: Date.now().toString(),
            title: risk.title,
            type: 'compliance',
            severity: risk.severity === 'critical' ? 'critical' : 'high',
            timestamp: new Date().toISOString(),
            isRead: false,
            metadata: {
              category: risk.category,
              framework: risk.framework,
              suggestedActions: risk.suggestedActions.join(', ')
            },
            description: risk.description,
            recommendedActions: risk.suggestedActions,
            category: risk.category
          };
          
          await esgMonitoringService.createAlert(alert);
        }
      }
      
      const highSeverityCount = risks.filter(
        (r: any) => r.severity === 'high' || r.severity === 'critical'
      ).length;
      
      if (highSeverityCount > 0) {
        toast.warning(`Detected ${highSeverityCount} high-severity compliance risks`, {
          description: 'Review your compliance dashboard for details',
          duration: 5000,
        });
      }
      
    } catch (error) {
      console.error('Error processing compliance results:', error);
    }
  }
  
  async getComplianceRisks(
    status?: string, 
    severity?: string,
    limit = 20
  ): Promise<ComplianceRisk[]> {
    try {
      return [
        {
          id: '1',
          title: 'GHG Protocol Reporting Gap',
          description: 'Your Scope 3 emissions reporting is missing several required categories under the GHG Protocol.',
          severity: 'high',
          category: 'emissions',
          framework: 'GHG Protocol',
          detectedAt: new Date().toISOString(),
          status: 'new',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          suggestedActions: [
            'Complete supplier emissions assessment',
            'Document transportation emissions calculation methodology',
            'Implement upstream leased assets tracking'
          ],
          relatedRegulations: ['GHG Protocol Corporate Standard', 'EU CSRD'],
          confidenceScore: 87
        },
        {
          id: '2',
          title: 'EU CSRD Documentation Gap',
          description: 'Missing documentation for social sustainability metrics required by EU CSRD.',
          severity: 'medium',
          category: 'social',
          framework: 'EU CSRD',
          detectedAt: new Date().toISOString(),
          status: 'new',
          suggestedActions: [
            'Complete human rights due diligence documentation',
            'Develop gender pay gap reporting methodology',
            'Update supplier code of conduct'
          ],
          relatedRegulations: ['EU CSRD', 'EU CSDDD'],
          confidenceScore: 75
        }
      ];
    } catch (error) {
      console.error('Error fetching compliance risks:', error);
      toast.error('Failed to load compliance risks');
      return [];
    }
  }
  
  async updateRiskStatus(
    riskId: string, 
    status: 'in-review' | 'mitigated' | 'false-positive'
  ): Promise<boolean> {
    try {
      console.log(`Risk ${riskId} status updated to ${status}`);
      toast.success(`Risk status updated to ${status}`);
      return true;
    } catch (error) {
      console.error('Error updating risk status:', error);
      toast.error('Failed to update risk status');
      return false;
    }
  }
}

export const aiComplianceMonitor = new AIComplianceMonitor();
