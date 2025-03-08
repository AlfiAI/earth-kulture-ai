
import { 
  ESGDataPoint, 
  CarbonEmission, 
  ComplianceFramework,
  AIInsight,
  ESGScore,
  ESGReport
} from '../../types/esgTypes';
import { reportingService } from '../../reporting/reportingService';

class ReportingEsgService {
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

export const reportingEsgService = new ReportingEsgService();
