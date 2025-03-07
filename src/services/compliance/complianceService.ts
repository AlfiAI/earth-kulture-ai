
import { ComplianceFramework } from '../types/esgTypes';
import { complianceFrameworks } from '../data/sampleEsgData';

class ComplianceService {
  // Get compliance frameworks
  getComplianceFrameworks(): Promise<ComplianceFramework[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(complianceFrameworks);
      }, 500);
    });
  }
}

export const complianceService = new ComplianceService();
