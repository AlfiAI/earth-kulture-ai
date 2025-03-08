
import { CarbonEmission } from '../../types/esgTypes';
import { carbonService } from '../../carbon/carbonService';

class CarbonEsgService {
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
}

export const carbonEsgService = new CarbonEsgService();
