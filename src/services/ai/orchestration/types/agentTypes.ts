
// Define the types of specialized AI agents
export type AgentType = 'data-processing' | 'regulatory-compliance' | 'predictive-analytics';

// Define industry types
export type IndustryType = 'corporate' | 'sme' | 'government' | 'individual' | 'education' | 'healthcare' | 'energy' | 'manufacturing' | 'financial' | 'retail' | 'technology' | 'other';

// Define user role types
export type UserRoleType = 'admin' | 'manager' | 'analyst' | 'viewer' | 'individual';

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
  industryContext?: IndustryType;
  userRole?: UserRoleType;
}

// Local AI processing configuration
export interface LocalAIConfig {
  enabled: boolean;
  url: string;
  modelName: string;
  available: boolean | null;
  lastCheck: number;
}

// Multi-tenant configuration
export interface TenantConfig {
  id: string;
  name: string;
  industryType: IndustryType;
  features: {
    localAIEnabled: boolean;
    advancedAnalyticsEnabled: boolean;
    customReportingEnabled: boolean;
    teamCollaborationEnabled: boolean;
  };
}

// User context for AI processing
export interface UserContext {
  userId: string;
  tenantId?: string;
  industry: IndustryType;
  role: UserRoleType;
  preferences: {
    dashboardType: 'individual' | 'business' | 'enterprise';
    dataVisualizationPreference: 'detailed' | 'summary' | 'visual';
    reportFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  };
}
