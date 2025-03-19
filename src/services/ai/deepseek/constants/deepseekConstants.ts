
/**
 * Constants for the DeepSeek API, including energy-efficient models
 */
import { ModelType, ModelConfig } from '../types/deepseekTypes';

// API configuration
export const DEEPSEEK_API_BASE_URL = 'https://api.deepseek.com';
// In Vite, environment variables are accessed using import.meta.env instead of process.env
export const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

// Model configuration with energy efficiency metrics
export const MODEL_CONFIG: Record<ModelType, ModelConfig> = {
  'deepseek-chat': {
    name: 'DeepSeek-V3',
    systemPrompt: 'You are a helpful, accurate, and concise assistant. Provide accurate and direct answers.',
    temperature: 0.7,
    maxTokens: 4000,
    contextLength: 64000,
    costPerInputTokenCacheMiss: 0.27,
    costPerInputTokenCacheHit: 0.07,
    costPerOutputToken: 1.10,
    discountPercentage: 0.5,  // 50% discount during off-peak hours
    energyEfficiency: {
      carbonFootprint: 1.2,
      energyUsage: 0.0015,
      isEcoFriendly: false
    }
  },
  'deepseek-reasoner': {
    name: 'DeepSeek-R1',
    systemPrompt: 'You are a logical reasoning assistant designed to think step-by-step through complex problems. Analyze thoroughly before concluding.',
    temperature: 0.3,
    maxTokens: 8000,
    contextLength: 64000,
    costPerInputTokenCacheMiss: 0.55,
    costPerInputTokenCacheHit: 0.14,
    costPerOutputToken: 2.19,
    discountPercentage: 0.75,  // 75% discount during off-peak hours
    energyEfficiency: {
      carbonFootprint: 1.8,
      energyUsage: 0.0022,
      isEcoFriendly: false
    }
  },
  'mistral-large': {
    name: 'Mistral Large',
    systemPrompt: 'You are a helpful assistant that provides accurate information and balanced analysis.',
    temperature: 0.7,
    maxTokens: 4000,
    contextLength: 32000,
    costPerInputTokenCacheMiss: 0.25,
    costPerInputTokenCacheHit: 0.06,
    costPerOutputToken: 0.75,
    discountPercentage: 0.25,
    energyEfficiency: {
      carbonFootprint: 0.9,
      energyUsage: 0.0012,
      isEcoFriendly: true
    }
  },
  'mistral-small': {
    name: 'Mistral Small',
    systemPrompt: 'You are a helpful assistant that provides concise and accurate responses.',
    temperature: 0.7,
    maxTokens: 4000,
    contextLength: 32000,
    costPerInputTokenCacheMiss: 0.15,
    costPerInputTokenCacheHit: 0.04,
    costPerOutputToken: 0.4,
    discountPercentage: 0.25,
    energyEfficiency: {
      carbonFootprint: 0.5,
      energyUsage: 0.0006,
      isEcoFriendly: true
    }
  },
  'mistral-tiny': {
    name: 'Mistral Tiny',
    systemPrompt: 'You are a helpful assistant that provides brief, concise answers.',
    temperature: 0.7,
    maxTokens: 2000,
    contextLength: 8000,
    costPerInputTokenCacheMiss: 0.06,
    costPerInputTokenCacheHit: 0.02,
    costPerOutputToken: 0.15,
    discountPercentage: 0.25,
    energyEfficiency: {
      carbonFootprint: 0.2,
      energyUsage: 0.0003,
      isEcoFriendly: true
    }
  }
};

// Default model to use
export const DEFAULT_MODEL: ModelType = 'mistral-small';

// Cache configuration
export const DEFAULT_CACHE_EXPIRY = 30 * 60; // 30 minutes in seconds

// Energy efficiency settings
export const ENABLE_ECO_MODE_BY_DEFAULT = true;
export const CARBON_BUDGET_PER_DAY = 10; // gCO2e
