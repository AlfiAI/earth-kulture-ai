
/**
 * Types for AI Agent Orchestration
 */

// Base AI agent interface
export interface AIAgent {
  name: string;
  processWithLocalAI?(payload: any): Promise<any>;
  processWithCloudAI?(payload: any): Promise<any>;
}

// Task priority for scheduling
export enum TaskPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  NORMAL = 'normal',
  LOW = 'low'
}

// Use string literals for these values to match what's used in the code
export type TaskPriorityString = 'critical' | 'high' | 'medium' | 'normal' | 'low';

// AI processing mode
export enum AIMode {
  AUTO = 'auto',     // Let orchestrator decide where to process
  LOCAL = 'local',   // Force local processing
  CLOUD = 'cloud'    // Force cloud processing
}

// Task state for tracking
export enum TaskState {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PENDING = 'pending'  // Added to match string literal usage
}

// Industry types for ESG benchmarking and context
export enum IndustryType {
  CORPORATE = 'CORPORATE',
  SME = 'SME',
  GOVERNMENT = 'GOVERNMENT',
  INDIVIDUAL = 'INDIVIDUAL',
  EDUCATION = 'EDUCATION',
  HEALTHCARE = 'HEALTHCARE',
  ENERGY = 'ENERGY',
  MANUFACTURING = 'MANUFACTURING',
  FINANCIAL = 'FINANCIAL',
  RETAIL = 'RETAIL',
  TECHNOLOGY = 'TECHNOLOGY',
  OTHER = 'OTHER',
  VIEWER = 'VIEWER'
}

// User role types for permissions and context
export enum UserRoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER',
  ANALYST = 'ANALYST',
  EXECUTIVE = 'EXECUTIVE',
  SUSTAINABILITY_LEAD = 'SUSTAINABILITY_LEAD',
  GUEST = 'GUEST',
  VIEWER = 'VIEWER'
}

// Task definition
export interface AITask {
  id: string;
  agentType: string;
  payload: any;
  priority: TaskPriority;
  mode: AIMode;
  state: TaskState;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

// Configuration for local AI processing
export interface LocalAIConfig {
  modelPath: string;
  maxTokens: number;
  temperature: number;
  contextWindow: number;
  processingMode: 'cpu' | 'gpu';
  available?: boolean;
  lastCheck?: Date;
  url?: string;
  modelName?: string;
}

// Task status response
export interface TaskStatusResponse {
  id: string;
  status: TaskState;
  result?: any;
  error?: string;
}

