
import { supabase } from "@/integrations/supabase/client";
import { alertService } from './alerts/alertService';
import { complianceMonitor } from './compliance/complianceMonitor';
import { analyticsMonitor } from './analytics/analyticsMonitor';
import { aiComplianceMonitor } from './compliance/aiComplianceMonitor';
import { toast } from "sonner";

/**
 * ESG Intelligence Item from external sources
 */
export interface ESGIntelligenceItem {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: string;
  relevanceScore: number; // 0-100
  publishDate: string;
  topics: string[];
  regions: string[];
  industries: string[];
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
   * @param industry Optional industry filter
   * @param region Optional region filter
   * @param category Optional category filter
   * @returns Promise with intelligence data
   */
  async gatherESGIntelligence(industry?: string, region?: string, category?: string): Promise<ESGIntelligenceItem[]> {
    try {
      // Check cache first
      const cached = await this.getIntelligenceFromCache(industry, region, category);
      if (cached && cached.length > 0) {
        console.log('Using cached ESG intelligence data');
        return cached;
      }
      
      // Call the Supabase function to gather new intelligence
      const { data, error } = await supabase.functions.invoke('esg-intelligence-aggregator', {
        body: { industry, region, category }
      });
      
      if (error) throw error;
      
      return data?.data || [];
    } catch (error) {
      console.error('Error gathering ESG intelligence:', error);
      toast.error('Failed to gather ESG intelligence');
      return [];
    }
  }
  
  /**
   * Get ESG intelligence from cache
   */
  private async getIntelligenceFromCache(industry?: string, region?: string, category?: string): Promise<ESGIntelligenceItem[] | null> {
    try {
      let query = supabase
        .from('esg_intelligence_cache')
        .select('*')
        .lt('expires_at', new Date().toISOString())
        .order('relevance_score', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (industry) {
        query = query.contains('industries', [industry]);
      }
      
      if (region) {
        query = query.contains('regions', [region]);
      }
      
      const { data, error } = await query.limit(20);
      
      if (error || !data) return null;
      
      // Transform from database format to ESGIntelligenceItem
      return data.map(item => ({
        title: item.title,
        summary: item.summary,
        source: item.source,
        sourceUrl: item.source_url,
        category: item.category,
        relevanceScore: item.relevance_score,
        publishDate: item.publish_date,
        topics: item.topics,
        regions: item.regions,
        industries: item.industries
      }));
    } catch (error) {
      console.error('Error fetching intelligence from cache:', error);
      return null;
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
