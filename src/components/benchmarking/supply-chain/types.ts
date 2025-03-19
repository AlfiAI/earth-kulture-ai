
export interface Supplier {
  id: string;
  name: string;
  location: string;
  region: string;
  country: string;
  tier: 'tier1' | 'tier2' | 'other';
  sustainabilityScore: number;
  verified: boolean;
  products: string[];
  certifications: string[];
}

export interface SustainabilityMetrics {
  overall: number;
  environmental: number;
  social: number;
  governance: number;
  carbonEmissions: number;
  waterUsage: number;
  wasteManagement: number;
  laborPractices: number;
}
