
export interface MaterialMetrics {
  carbonFootprint: number; // kg CO2e
  waterUsage: number; // liters
  energyUsage: number; // MJ
  toxicityScore: number; // 0-10 scale
  renewabilityScore: number; // percentage
}

export interface MaterialProperties {
  recyclable: boolean;
  biodegradable: boolean;
  lowCarbon: boolean;
  certificated: boolean;
}

export interface MaterialAlternative {
  id: string;
  name: string;
  description: string;
  sustainabilityScore: number;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  category: string;
  sustainabilityScore: number; // 0-100 scale
  metrics: MaterialMetrics;
  properties: MaterialProperties;
  alternatives: MaterialAlternative[];
  certifications: string[];
}

export interface MaterialFilters {
  recyclable: boolean;
  lowCarbon: boolean;
  biodegradable: boolean;
  certificated: boolean;
}
