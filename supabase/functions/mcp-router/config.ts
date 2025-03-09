
// Configuration parameters for MCP Router

// AI model options
export const AI_MODELS = {
  DEFAULT: "gpt-4o-mini",
  ADVANCED: "gpt-4o",
  LOCAL: "ollama", // Added local model option
};

// Threshold rules for model selection
export const MODEL_SELECTION_RULES = {
  PROMPT_LENGTH_THRESHOLD: 100, // Characters
  COMPLEXITY_THRESHOLD: 0.7,    // 0-1 scale
  PRIORITY_USERS: ["admin", "premium"], // User roles that get advanced models
  LOCAL_COMPLEXITY_THRESHOLD: 0.4, // Threshold for using local models
};

// Maximum history messages to include in context
export const MAX_CONTEXT_MESSAGES = 5;

// Context expiration time in milliseconds (30 minutes)
export const CONTEXT_EXPIRATION_MS = 30 * 60 * 1000;

// Cache TTL in milliseconds (5 minutes)
export const CACHE_TTL_MS = 5 * 60 * 1000;

// CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Restricted words for basic content filtering
export const RESTRICTED_WORDS = [
  "offensive", "explicit", "harmful", "illegal", "violent"
];

// Hybrid AI processing configuration
export const HYBRID_AI_CONFIG = {
  ENABLED: true,
  LOCAL_MODEL_URL: "http://localhost:11434/api/chat",
  LOCAL_MODEL_NAME: "llama3",
  MAX_LOCAL_TOKENS: 1024,
  API_FALLBACK_THRESHOLD: 3, // Number of failed API calls before defaulting to local
};
