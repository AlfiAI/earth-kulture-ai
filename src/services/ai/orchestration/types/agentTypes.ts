
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
