
import { 
  ESGDataPoint, 
  CarbonEmission, 
  ComplianceFramework,
  AIInsight,
  ESGScore,
  ESGReport
} from './types/esgTypes';
import { coreEsgService } from './esg/core/coreEsgService';
import { carbonEsgService } from './esg/carbon/carbonEsgService';
import { complianceEsgService } from './esg/compliance/complianceEsgService';
import { reportingEsgService } from './esg/reporting/reportingEsgService';

// Facade service that coordinates all ESG data operations
class ESGDataService {
  // ESG Data Methods
  getAllESGData(): Promise<ESGDataPoint[]> {
    return coreEsgService.getAllESGData();
  }

  processESGData(data: Partial<ESGDataPoint>): Promise<ESGDataPoint> {
    return coreEsgService.processESGData(data);
  }

  // Carbon Methods
  getCarbonEmissions(): Promise<CarbonEmission[]> {
    return carbonEsgService.getCarbonEmissions();
  }

  calculateCarbonFootprint(emissions: CarbonEmission[]): { 
    scope1: number, 
    scope2: number, 
    scope3: number, 
    total: number 
  } {
    return carbonEsgService.calculateCarbonFootprint(emissions);
  }

  // Compliance Methods
  getComplianceFrameworks(): Promise<ComplianceFramework[]> {
    return complianceEsgService.getComplianceFrameworks();
  }

  // Reporting and Analytics Methods
  generateESGInsights(
    esgData: ESGDataPoint[], 
    emissions: CarbonEmission[], 
    frameworks: ComplianceFramework[]
  ): Promise<AIInsight[]> {
    return reportingEsgService.generateESGInsights(esgData, emissions, frameworks);
  }

  calculateESGScore(
    esgData: ESGDataPoint[], 
    emissions: CarbonEmission[], 
    frameworks: ComplianceFramework[]
  ): Promise<ESGScore> {
    return reportingEsgService.calculateESGScore(esgData, emissions, frameworks);
  }

  generateESGReport(params: {
    dateRange: { start: string, end: string },
    frameworks: string[],
    focusAreas: string[]
  }): Promise<ESGReport> {
    return reportingEsgService.generateESGReport(params);
  }
}

// Export a singleton instance
export const esgDataService = new ESGDataService();

// Re-export types for convenience
export type { 
  ESGDataPoint,
  CarbonEmission,
  ComplianceFramework,
  ComplianceRequirement,
  AIInsight,
  ESGScore,
  ESGReport,
  SustainabilityGoal,
  ActionStep
} from './types/esgTypes';
