
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
  CRITICAL = 0,
  HIGH = 1,
  NORMAL = 2,
  LOW = 3
}

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
  FAILED = 'failed'
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

// Industry types for ESG benchmarking and context
export enum IndustryType {
  CORPORATE = 'corporate',
  SME = 'sme',
  GOVERNMENT = 'government',
  INDIVIDUAL = 'individual',
  EDUCATION = 'education',
  HEALTHCARE = 'healthcare',
  ENERGY = 'energy',
  MANUFACTURING = 'manufacturing',
  FINANCIAL = 'financial',
  RETAIL = 'retail',
  TECHNOLOGY = 'technology',
  OTHER = 'other'
}

// User role types for permissions and context
export enum UserRoleType {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  ANALYST = 'analyst',
  EXECUTIVE = 'executive',
  SUSTAINABILITY_LEAD = 'sustainability_lead',
  GUEST = 'guest'
}

// Agent types for orchestration
export type AgentType = 
  | 'data-processing'
  | 'regulatory-compliance'
  | 'predictive-analytics'
  | 'risk-assessment'
  | 'benchmarking'
  | 'reporting';

// Configuration for local AI processing
export interface LocalAIConfig {
  modelPath: string;
  maxTokens: number;
  temperature: number;
  contextWindow: number;
  processingMode: 'cpu' | 'gpu';
}

// Task definition for agent queue
export interface AgentTask {
  id: string;
  agentType: AgentType;
  payload: any;
  priority: TaskPriority;
  createdAt: Date;
  status: TaskState;
  result?: any;
  error?: string;
}

// Task status response
export interface TaskStatusResponse {
  id: string;
  status: TaskState;
  result?: any;
  error?: string;
}
