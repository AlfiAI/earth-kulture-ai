
export interface ARIESModel {
  id: string;
  name: string;
  description: string;
  category: 'carbon' | 'water' | 'biodiversity' | 'land' | 'comprehensive';
  complexity: 'simple' | 'moderate' | 'advanced';
  dataRequirements: string;
  processingTime: string;
  parameters?: ARIESModelParameter[];
}

export interface ARIESModelParameter {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'number' | 'select' | 'slider' | 'boolean';
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { label: string; value: string }[];
}

export interface ARIESModelResult {
  id: string;
  modelId: string;
  modelName: string;
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  dataPoints: any[];
  dataVisualization: boolean;
  processedAt: string;
  processingTimeSeconds: number;
}
