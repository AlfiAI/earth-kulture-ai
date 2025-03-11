
/**
 * Type definitions for the DeepSeek API
 */

export type ModelType = 'deepseek-chat' | 'deepseek-reasoner';

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
}

export interface DeepseekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface DeepseekRequestOptions {
  preferredModel?: ModelType;
  forceCloud?: boolean;
  temperature?: number;
  maxTokens?: number;
}
