
// Update existing types with additional energy-efficient model options

export type ModelType = 
  'deepseek-chat' | 
  'deepseek-reasoner' | 
  'mistral-small' | 
  'mistral-large' | 
  'mistral-tiny';

export interface ModelConfig {
  name: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  contextLength: number;
  costPerInputTokenCacheMiss: number;
  costPerInputTokenCacheHit: number;
  costPerOutputToken: number;
  discountPercentage: number;
  energyEfficiency?: {
    carbonFootprint: number; // gCO2e per query
    energyUsage: number;     // Joules per token
    isEcoFriendly: boolean;
  };
}

export interface DeepseekRequestOptions {
  preferredModel?: ModelType;
  systemPrompt?: string;
  forceCloud?: boolean;
  ecoMode?: boolean;
}
