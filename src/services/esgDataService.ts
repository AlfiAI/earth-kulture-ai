
import { toast } from "sonner";
import { 
  ESGDataPoint, 
  CarbonEmission, 
  ComplianceFramework,
  AIInsight,
  ESGScore,
  ESGReport
} from './types/esgTypes';
import { esgDataCoreService } from './core/esgDataService';
import { carbonService } from './carbon/carbonService';
import { complianceService } from './compliance/complianceService';
import { reportingService } from './reporting/reportingService';

// Facade service that coordinates all ESG data operations
class ESGDataService {
  // ESG Data Methods
  getAllESGData(): Promise<ESGDataPoint[]> {
    return esgDataCoreService.getAllESGData();
  }

  processESGData(data: Partial<ESGDataPoint>): Promise<ESGDataPoint> {
    return esgDataCoreService.processESGData(data);
  }

  // Carbon Methods
  getCarbonEmissions(): Promise<CarbonEmission[]> {
    return carbonService.getCarbonEmissions();
  }

  calculateCarbonFootprint(emissions: CarbonEmission[]): { 
    scope1: number, 
    scope2: number, 
    scope3: number, 
    total: number 
  } {
    return carbonService.calculateCarbonFootprint(emissions);
  }

  // Compliance Methods
  getComplianceFrameworks(): Promise<ComplianceFramework[]> {
    return complianceService.getComplianceFrameworks();
  }

  // Reporting and Analytics Methods
  generateESGInsights(
    esgData: ESGDataPoint[], 
    emissions: CarbonEmission[], 
    frameworks: ComplianceFramework[]
  ): Promise<AIInsight[]> {
    return reportingService.generateESGInsights(esgData, emissions, frameworks);
  }

  calculateESGScore(
    esgData: ESGDataPoint[], 
    emissions: CarbonEmission[], 
    frameworks: ComplianceFramework[]
  ): Promise<ESGScore> {
    return reportingService.calculateESGScore(esgData, emissions, frameworks);
  }

  generateESGReport(params: {
    dateRange: { start: string, end: string },
    frameworks: string[],
    focusAreas: string[]
  }): Promise<ESGReport> {
    return reportingService.generateESGReport(params);
  }
}

// Export a singleton instance
export const esgDataService = new ESGDataService();

// Re-export types for convenience
export {
  ESGDataPoint,
  CarbonEmission,
  ComplianceFramework,
  ComplianceRequirement,
  AIInsight,
  ESGScore,
  ESGReport
} from './types/esgTypes';
