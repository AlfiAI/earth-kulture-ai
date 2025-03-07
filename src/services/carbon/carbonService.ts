
import { CarbonEmission } from '../types/esgTypes';
import { sampleCarbonEmissions } from '../data/sampleEsgData';

class CarbonService {
  // Get carbon emissions data
  getCarbonEmissions(): Promise<CarbonEmission[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sampleCarbonEmissions);
      }, 500);
    });
  }

  // Calculate carbon footprint
  calculateCarbonFootprint(emissions: CarbonEmission[]): { 
    scope1: number, 
    scope2: number, 
    scope3: number, 
    total: number 
  } {
    const scope1 = emissions
      .filter(e => e.scope === 'scope1')
      .reduce((sum, e) => sum + e.amount, 0);
      
    const scope2 = emissions
      .filter(e => e.scope === 'scope2')
      .reduce((sum, e) => sum + e.amount, 0);
      
    const scope3 = emissions
      .filter(e => e.scope === 'scope3')
      .reduce((sum, e) => sum + e.amount, 0);
      
    return {
      scope1,
      scope2,
      scope3,
      total: scope1 + scope2 + scope3
    };
  }
}

export const carbonService = new CarbonService();
