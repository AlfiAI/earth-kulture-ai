
/**
 * Types for DeepSeek API service
 */

// Interface for API response
export interface DeepseekR1Response {
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

// Message format for API
export interface DeepseekMessage {
  role: string;
  content: string;
}

// Intent categories for query classification
export type IntentCategory = 'compliance' | 'reporting' | 'benchmarking' | 'carbon' | 'general' | 'complex' | 'analysis';

// Model configuration
export interface ModelConfiguration {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  reason: string;
}
