
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { aiAgentOrchestrator } from '../../orchestration/aiAgentOrchestrator';
import { esgMonitoringService, ESGAlert } from '../esgMonitoringService';

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
  
  /**
   * Start continuous compliance monitoring
   */
  startContinuousMonitoring(intervalMinutes: number = 30): void {
    // Clear any existing monitoring
    this.stopContinuousMonitoring();
    
    // Run an initial check
    this.runComplianceCheck();
    
    // Set up interval for regular checks
    this.monitoringInterval = window.setInterval(() => {
      this.runComplianceCheck();
    }, intervalMinutes * 60 * 1000);
    
    console.log(`AI Compliance monitoring started (interval: ${intervalMinutes} minutes)`);
  }
  
  /**
   * Stop continuous compliance monitoring
   */
  stopContinuousMonitoring(): void {
    if (this.monitoringInterval !== null) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('AI Compliance monitoring stopped');
    }
  }
  
  /**
   * Run a comprehensive compliance check using AI pattern recognition
   */
  async runComplianceCheck(): Promise<void> {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('Running AI compliance check...');
    
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      // Fetch recent ESG data
      const { data: esgData, error: esgError } = await supabase
        .from('esg_data')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (esgError) throw esgError;
      
      // Fetch current compliance status
      const { data: complianceData, error: complianceError } = await supabase
        .from('compliance_status')
        .select('*, compliance_frameworks(*)')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(20);
        
      if (complianceError) throw complianceError;
      
      // Fetch recent regulatory updates
      const { data: regulationsData, error: regulationsError } = await supabase
        .from('esg_regulatory_updates')
        .select('*')
        .order('published_date', { ascending: false })
        .limit(20);
        
      if (regulationsError) throw regulationsError;
      
      // Submit to AI orchestrator for analysis
      const taskId = await aiAgentOrchestrator.submitTask('regulatory-compliance', {
        esgData,
        complianceData,
        regulationsData,
        userId,
        action: 'detect-compliance-risks'
      }, 'high');
      
      // Check for task completion
      let retries = 0;
      const maxRetries = 12; // Check for up to 1 minute
      
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
          // Check again in 5 seconds
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
  
  /**
   * Process and store compliance check results
   */
  private async processComplianceResults(results: any, userId: string): Promise<void> {
    try {
      const risks = results.detectedRisks || [];
      console.log(`Processing ${risks.length} compliance risks`);
      
      if (risks.length === 0) {
        console.log('No compliance risks detected');
        return;
      }
      
      // Store each detected risk
      for (const risk of risks) {
        // Store in database for historical tracking
        const { error } = await supabase
          .from('esg_compliance_risks')
          .insert({
            user_id: userId,
            title: risk.title,
            description: risk.description,
            severity: risk.severity,
            category: risk.category,
            framework: risk.framework,
            confidence_score: risk.confidenceScore,
            suggested_actions: risk.suggestedActions,
            related_regulations: risk.relatedRegulations,
            status: 'new'
          });
          
        if (error) {
          console.error('Error storing compliance risk:', error);
          continue;
        }
        
        // Create alerts for high and critical risks
        if (risk.severity === 'high' || risk.severity === 'critical') {
          const alert: ESGAlert = {
            id: Date.now().toString(),
            title: risk.title,
            message: risk.description,
            type: 'compliance',
            severity: risk.severity === 'critical' ? 'critical' : 'high',
            timestamp: new Date().toISOString(),
            isRead: false,
            metadata: {
              category: risk.category,
              framework: risk.framework,
              suggestedActions: risk.suggestedActions.join(', ')
            }
          };
          
          await esgMonitoringService.createAlert(alert);
        }
      }
      
      // If high severity risks exist, show a toast notification
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
  
  /**
   * Get detected compliance risks
   */
  async getComplianceRisks(
    status?: string, 
    severity?: string,
    limit = 20
  ): Promise<ComplianceRisk[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      let query = supabase
        .from('esg_compliance_risks')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('detected_at', { ascending: false });
        
      if (status) {
        query = query.eq('status', status);
      }
      
      if (severity) {
        query = query.eq('severity', severity);
      }
      
      const { data, error } = await query.limit(limit);
      
      if (error) throw error;
      
      return data.map(risk => ({
        id: risk.id,
        title: risk.title,
        description: risk.description,
        severity: risk.severity,
        category: risk.category,
        framework: risk.framework,
        detectedAt: risk.detected_at,
        status: risk.status,
        dueDate: risk.due_date,
        suggestedActions: risk.suggested_actions,
        relatedRegulations: risk.related_regulations,
        confidenceScore: risk.confidence_score
      }));
    } catch (error) {
      console.error('Error fetching compliance risks:', error);
      toast.error('Failed to load compliance risks');
      return [];
    }
  }
  
  /**
   * Update risk status
   */
  async updateRiskStatus(
    riskId: string, 
    status: 'in-review' | 'mitigated' | 'false-positive'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('esg_compliance_risks')
        .update({ status })
        .eq('id', riskId);
        
      if (error) throw error;
      
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
