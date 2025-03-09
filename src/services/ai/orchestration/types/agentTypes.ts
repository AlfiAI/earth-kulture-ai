
// Define the types of specialized AI agents
export type AgentType = 'data-processing' | 'regulatory-compliance' | 'predictive-analytics';

// Agent task interface
export interface AgentTask {
  id: string;
  agentType: AgentType;
  payload: any;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
  useLocalAI?: boolean;
}

// Local AI processing configuration
export interface LocalAIConfig {
  enabled: boolean;
  url: string;
  modelName: string;
  available: boolean | null;
  lastCheck: number;
}
