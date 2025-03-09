
import { supabase } from "@/integrations/supabase/client";
import { alertService } from './alerts/alertService';
import { complianceMonitor } from './compliance/complianceMonitor';
import { analyticsMonitor } from './analytics/analyticsMonitor';
import { aiComplianceMonitor } from './compliance/aiComplianceMonitor';

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
    
    // Start immediate check
    this.runMonitoringCheck();
    
    // Set up regular interval
    this.monitoringInterval = window.setInterval(() => {
      this.runMonitoringCheck();
    }, intervalMinutes * 60 * 1000);
    
    // Start the advanced AI compliance monitoring with a shorter interval
    aiComplianceMonitor.startContinuousMonitoring(30);
    
    console.log(`Automated ESG monitoring started (interval: ${intervalMinutes} minutes)`);
  }
  
  /**
   * Stop automated ESG monitoring
   */
  stopAutomatedMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      
      // Also stop AI compliance monitoring
      aiComplianceMonitor.stopContinuousMonitoring();
      
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
        complianceMonitor.checkComplianceStatus(userId),
        complianceMonitor.checkRegulatoryUpdates(userId),
        analyticsMonitor.analyzePerformanceTrends(userId)
      ]);
      
      console.log('ESG monitoring check completed');
    } catch (error) {
      console.error('Error during ESG monitoring check:', error);
    } finally {
      this.isMonitoring = false;
    }
  }
  
  /**
   * Gather real-time ESG intelligence from external sources
   */
  async gatherESGIntelligence(industry?: string, region?: string, category?: string): Promise<any> {
    try {
      const { data } = await supabase.functions.invoke('esg-intelligence-aggregator', {
        body: { industry, region, category }
      });
      
      return data;
    } catch (error) {
      console.error('Error gathering ESG intelligence:', error);
      throw error;
    }
  }
  
  // Expose alert methods directly from this service for backward compatibility
  createAlert = alertService.createAlert.bind(alertService);
  getAlerts = alertService.getAlerts.bind(alertService);
  markAlertAsRead = alertService.markAlertAsRead.bind(alertService);
}

// Re-export types with 'export type' syntax to fix isolatedModules error
export type { ESGAlert, AlertSeverity, AlertType } from './types/alertTypes';

export const esgMonitoringService = new ESGMonitoringService();
