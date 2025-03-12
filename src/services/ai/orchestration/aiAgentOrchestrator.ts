
import { dataProcessingAgent } from './agents/dataProcessingAgent';
import { regulatoryComplianceAgent } from './agents/regulatoryComplianceAgent';
import { predictiveAnalyticsAgent } from './agents/predictiveAnalyticsAgent';
import { AIAgent, TaskPriority, AIMode, TaskState, AgentType, TaskStatusResponse } from './types/agentTypes';

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
  private taskHistory: Map<string, TaskStatusResponse> = new Map();

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

  // Submit a task to the orchestrator
  async submitTask(
    agentType: string,
    payload: any,
    priority: TaskPriority = this.config.defaultPriority
  ): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Add to queue with metadata
    this.taskQueue.push({
      id: taskId,
      agentType,
      payload,
      priority,
      state: TaskState.QUEUED,
      createdAt: new Date(),
      mode: this.config.defaultMode
    });
    
    // Update task history
    this.taskHistory.set(taskId, {
      id: taskId,
      status: TaskState.QUEUED
    });
    
    // Sort queue by priority
    this.taskQueue.sort((a, b) => {
      if (a.priority === b.priority) {
        return a.createdAt.getTime() - b.createdAt.getTime(); // FIFO for same priority
      }
      return a.priority - b.priority; // Higher priority first
    });
    
    // Start processing if not already in progress
    if (!this.processing) {
      this.processTasks();
    }
    
    return taskId;
  }
  
  // Get status of a task
  getTaskStatus(taskId: string): TaskStatusResponse | null {
    const status = this.taskHistory.get(taskId);
    return status || null;
  }

  // Schedule a task for processing (legacy API)
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
    const { id, agentType, payload, mode } = task;
    
    try {
      // Update task status if it has an ID
      if (id) {
        this.taskHistory.set(id, {
          id,
          status: TaskState.PROCESSING
        });
      }
      
      // Get the appropriate agent
      const agent = this.getAgentByType(agentType);
      if (!agent) {
        throw new Error(`Agent type not found: ${agentType}`);
      }
      
      // Execute on the appropriate runtime
      const useLocal = mode === AIMode.LOCAL || 
                      (mode === AIMode.AUTO && this.config.preferLocalExecution);
      
      let result;
      if (useLocal) {
        if (agent.processWithLocalAI) {
          result = await agent.processWithLocalAI(payload);
        } else {
          throw new Error(`Local processing not supported for agent ${agentType}`);
        }
      } else {
        if (agent.processWithCloudAI) {
          result = await agent.processWithCloudAI(payload);
        } else {
          throw new Error(`Cloud processing not supported for agent ${agentType}`);
        }
      }
      
      // Update task status if it has an ID
      if (id) {
        this.taskHistory.set(id, {
          id,
          status: TaskState.COMPLETED,
          result
        });
      }
      
      return result;
    } catch (error) {
      console.error(`Error processing task for agent ${agentType}:`, error);
      
      // Update task status if it has an ID
      if (id) {
        this.taskHistory.set(id, {
          id,
          status: TaskState.FAILED,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      
      throw error;
    }
  }
  
  // Helper to get the right agent instance
  private getAgentByType(agentType: string): AIAgent | null {
    switch (agentType) {
      case 'dataProcessing':
      case 'data-processing':
        return dataProcessingAgent;
      case 'regulatoryCompliance':
      case 'regulatory-compliance':
        return regulatoryComplianceAgent;
      case 'predictiveAnalytics':
      case 'predictive-analytics':
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
