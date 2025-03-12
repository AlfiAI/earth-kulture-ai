
import { dataProcessingAgent } from './agents/dataProcessingAgent';
import { regulatoryComplianceAgent } from './agents/regulatoryComplianceAgent';
import { predictiveAnalyticsAgent } from './agents/predictiveAnalyticsAgent';
import { AIAgent, TaskPriority, AIMode } from './types/agentTypes';

// Typed configuration for orchestrator
interface OrchestrationConfig {
  preferLocalExecution: boolean;
  maxParallelTasks: number;
  defaultPriority: TaskPriority;
  defaultMode: AIMode;
}

class AIAgentOrchestratorImpl {
  private config: OrchestrationConfig;
  private taskQueue: any[] = [];
  private processing: boolean = false;

  constructor(config: OrchestrationConfig) {
    this.config = config;
  }

  // Initialize the orchestrator with the agents
  initialize() {
    console.log("AI Agent Orchestrator initialized with config:", this.config);
    // Register agents and capabilities
    return {
      dataProcessingAgent,
      regulatoryComplianceAgent,
      predictiveAnalyticsAgent
    };
  }

  // Schedule a task for processing
  async scheduleTask(
    task: {
      agentType: string;
      payload: any;
      priority?: TaskPriority;
      mode?: AIMode;
    }
  ): Promise<any> {
    const { agentType, payload, priority = this.config.defaultPriority, mode = this.config.defaultMode } = task;
    
    // Add to queue with metadata
    this.taskQueue.push({
      agentType,
      payload,
      priority,
      mode,
      timestamp: Date.now()
    });
    
    // Sort queue by priority
    this.taskQueue.sort((a, b) => {
      if (a.priority === b.priority) {
        return a.timestamp - b.timestamp; // FIFO for same priority
      }
      return a.priority - b.priority; // Higher priority first
    });
    
    // Start processing if not already in progress
    if (!this.processing) {
      this.processTasks();
    }
    
    // For simplicity, directly process and return the result 
    // In a real implementation, this would likely return a task ID
    // and the result would be fetched later or via callback
    return this.processTask(task);
  }
  
  // Process tasks from the queue
  private async processTasks() {
    if (this.taskQueue.length === 0) {
      this.processing = false;
      return;
    }
    
    this.processing = true;
    
    // Process up to maxParallelTasks
    const tasksToProcess = this.taskQueue.splice(0, this.config.maxParallelTasks);
    
    try {
      await Promise.all(tasksToProcess.map(task => this.processTask(task)));
    } catch (error) {
      console.error("Error processing AI tasks:", error);
    }
    
    // Continue with remaining tasks
    this.processTasks();
  }
  
  // Process an individual task
  private async processTask(task: any): Promise<any> {
    const { agentType, payload, mode } = task;
    
    try {
      // Get the appropriate agent
      const agent = this.getAgentByType(agentType);
      if (!agent) {
        throw new Error(`Agent type not found: ${agentType}`);
      }
      
      // Execute on the appropriate runtime
      const useLocal = mode === AIMode.LOCAL || 
                      (mode === AIMode.AUTO && this.config.preferLocalExecution);
      
      if (useLocal) {
        if (agentType === 'dataProcessing' && dataProcessingAgent.processWithLocalAI) {
          return await dataProcessingAgent.processWithLocalAI(payload);
        } else if (agentType === 'regulatoryCompliance' && regulatoryComplianceAgent.processWithLocalAI) {
          return await regulatoryComplianceAgent.processWithLocalAI(payload);
        } else if (agentType === 'predictiveAnalytics' && predictiveAnalyticsAgent.processWithLocalAI) {
          return await predictiveAnalyticsAgent.processWithLocalAI(payload);
        }
      } else {
        if (agentType === 'dataProcessing' && dataProcessingAgent.processWithCloudAI) {
          return await dataProcessingAgent.processWithCloudAI(payload);
        } else if (agentType === 'regulatoryCompliance' && regulatoryComplianceAgent.processWithCloudAI) {
          return await regulatoryComplianceAgent.processWithCloudAI(payload);
        } else if (agentType === 'predictiveAnalytics' && predictiveAnalyticsAgent.processWithCloudAI) {
          return await predictiveAnalyticsAgent.processWithCloudAI(payload);
        }
      }
      
      throw new Error(`No appropriate processing method found for agent ${agentType}`);
    } catch (error) {
      console.error(`Error processing task for agent ${agentType}:`, error);
      throw error;
    }
  }
  
  // Helper to get the right agent instance
  private getAgentByType(agentType: string): any {
    switch (agentType) {
      case 'dataProcessing':
        return dataProcessingAgent;
      case 'regulatoryCompliance':
        return regulatoryComplianceAgent;
      case 'predictiveAnalytics':
        return predictiveAnalyticsAgent;
      default:
        return null;
    }
  }
}

// Create and export singleton instance
export const aiAgentOrchestrator = new AIAgentOrchestratorImpl({
  preferLocalExecution: true,
  maxParallelTasks: 2,
  defaultPriority: TaskPriority.NORMAL,
  defaultMode: AIMode.AUTO
});

// Initialize on startup
const agents = aiAgentOrchestrator.initialize();

export { agents };
