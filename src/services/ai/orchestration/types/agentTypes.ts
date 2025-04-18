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

// Industry types for ESG benchmarking and context - lowercase for codebase consistency
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
  OTHER = 'other',
  VIEWER = 'viewer'
}

// User role types for permissions and context - lowercase for codebase consistency
export enum UserRoleType {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  ANALYST = 'analyst',
  EXECUTIVE = 'executive',
  SUSTAINABILITY_LEAD = 'sustainability_lead',
  GUEST = 'guest',
  VIEWER = 'viewer'
}

// Agent types for orchestration
export type AgentType = 
  | 'data-processing'
  | 'regulatory-compliance'
  | 'predictive-analytics'
  | 'risk-assessment'
  | 'benchmarking'
  | 'reporting';

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

// Task definition for agent queue
export interface AgentTask {
  id: string;
  agentType: AgentType;
  payload: any;
  priority: string;
  status: string;
  createdAt: Date;
  completedAt?: Date;
  useLocalAI?: boolean;
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
