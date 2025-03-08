
import { ComplianceFramework } from '../../types/esgTypes';
import { complianceService } from '../../compliance/complianceService';

class ComplianceEsgService {
  // Compliance Methods
  getComplianceFrameworks(): Promise<ComplianceFramework[]> {
    return complianceService.getComplianceFrameworks();
  }
}

export const complianceEsgService = new ComplianceEsgService();
