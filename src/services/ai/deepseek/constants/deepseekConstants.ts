
/**
 * Constants for the DeepSeek API
 */
import { ModelType, ModelConfig } from '../types/deepseekTypes';

// API configuration
export const DEEPSEEK_API_BASE_URL = 'https://api.deepseek.com';
export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

// Model configuration
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
    discountPercentage: 0.5  // 50% discount during off-peak hours
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
    discountPercentage: 0.75  // 75% discount during off-peak hours
  }
};

// Default model to use
export const DEFAULT_MODEL: ModelType = 'deepseek-chat';

// Cache configuration
export const DEFAULT_CACHE_EXPIRY = 30 * 60; // 30 minutes in seconds
