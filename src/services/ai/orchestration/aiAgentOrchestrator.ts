
import { toast } from "sonner";
import { AgentType } from './types/agentTypes';
import { LocalAIProcessor } from './local/localAIProcessor';
import { TaskManager } from './queue/taskManager';
import { DataProcessingAgent } from './agents/dataProcessingAgent';
import { RegulatoryComplianceAgent } from './agents/regulatoryComplianceAgent';
import { PredictiveAnalyticsAgent } from './agents/predictiveAnalyticsAgent';

/**
 * AI Agent Orchestrator - Manages communication between specialized AI agents
 */
class AIAgentOrchestrator {
  private taskManager: TaskManager;
  private localAIProcessor: LocalAIProcessor;
  private dataProcessingAgent: DataProcessingAgent;
  private regulatoryComplianceAgent: RegulatoryComplianceAgent;
  private predictiveAnalyticsAgent: PredictiveAnalyticsAgent;
  private apiFailureCount: number = 0;
  private readonly API_FALLBACK_THRESHOLD = 3;
  
  constructor() {
    // Initialize local AI processor
    this.localAIProcessor = new LocalAIProcessor({
      enabled: true,
      url: "http://localhost:11434/api/chat",
      modelName: "llama3",
      available: null,
      lastCheck: 0
    });
    
    // Initialize task manager
    this.taskManager = new TaskManager();
    
    // Initialize agents
    this.dataProcessingAgent = new DataProcessingAgent(this.localAIProcessor);
    this.regulatoryComplianceAgent = new RegulatoryComplianceAgent(this.localAIProcessor);
    this.predictiveAnalyticsAgent = new PredictiveAnalyticsAgent(this.localAIProcessor);
  }
  
  /**
   * Submit a task to be processed by a specific AI agent
   */
  async submitTask(
    agentType: AgentType, 
    payload: any, 
    priority: 'high' | 'medium' | 'low' = 'medium',
    forceLocalAI: boolean = false
  ): Promise<string> {
    // Check if we should use local AI
    const useLocalAI = forceLocalAI || 
                       (await this.shouldUseLocalAI(agentType, payload, priority));
    
    // Create a task and add it to the queue
    const taskId = this.taskManager.createTask(agentType, payload, priority, useLocalAI);
    
    // Start processing if not already running
    if (!this.taskManager.isCurrentlyProcessing()) {
      this.processTasks();
    }
    
    return taskId;
  }
  
  /**
   * Get the status of a specific task
   */
  getTaskStatus(taskId: string) {
    return this.taskManager.getTask(taskId);
  }
  
  /**
   * Process tasks in the queue
   */
  private async processTasks(): Promise<void> {
    if (this.taskManager.isCurrentlyProcessing()) return;
    
    this.taskManager.setProcessingStatus(true);
    
    try {
      // Get the next task
      const task = this.taskManager.getNextPendingTask();
      
      if (!task) {
        this.taskManager.setProcessingStatus(false);
        return;
      }
      
      this.taskManager.markTaskAsProcessing(task.id);
      
      // Route to appropriate agent
      try {
        const result = await this.routeTaskToAgent(task);
        this.taskManager.markTaskAsCompleted(task.id, result);
        
        // Reset API failure count on success if using cloud AI
        if (!task.useLocalAI) {
          this.apiFailureCount = 0;
        }
      } catch (error) {
        console.error(`Error processing task ${task.id}:`, error);
        this.taskManager.markTaskAsFailed(task.id, error.message);
        
        // Increment API failure count if using cloud AI
        if (!task.useLocalAI) {
          this.apiFailureCount++;
        }
      }
      
      // Continue processing remaining tasks
      this.taskManager.setProcessingStatus(false);
      this.processTasks();
    } catch (error) {
      console.error('Error in task processing:', error);
      this.taskManager.setProcessingStatus(false);
    }
  }
  
  /**
   * Route a task to the appropriate specialized agent
   */
  private async routeTaskToAgent(task: any): Promise<any> {
    const { agentType, payload, useLocalAI } = task;
    
    // Route to specific agent based on type
    switch (agentType) {
      case 'data-processing':
        return useLocalAI ? 
               this.dataProcessingAgent.processWithLocalAI(payload) : 
               this.dataProcessingAgent.processWithCloudAI(payload);
      
      case 'regulatory-compliance':
        return useLocalAI ? 
               this.regulatoryComplianceAgent.processWithLocalAI(payload) : 
               this.regulatoryComplianceAgent.processWithCloudAI(payload);
      
      case 'predictive-analytics':
        return useLocalAI ? 
               this.predictiveAnalyticsAgent.processWithLocalAI(payload) : 
               this.predictiveAnalyticsAgent.processWithCloudAI(payload);
      
      default:
        throw new Error(`Unknown agent type: ${agentType}`);
    }
  }
  
  /**
   * Determine if we should use local AI based on task type and payload
   */
  private async shouldUseLocalAI(agentType: AgentType, payload: any, priority: string): Promise<boolean> {
    // If local AI is not enabled, don't use it
    if (!(this.localAIProcessor.getConfig().enabled)) return false;
    
    // Check if local AI is available
    if (!(await this.localAIProcessor.isAvailable())) return false;
    
    // Always use cloud API for high priority tasks
    if (priority === 'high') return false;
    
    // Use local AI if cloud API is having issues
    if (this.apiFailureCount >= this.API_FALLBACK_THRESHOLD) return true;
    
    // Simple complexity check based on task type and payload
    const payloadString = typeof payload === 'string' ? 
                         payload : JSON.stringify(payload);
    const payloadSize = payloadString.length;
    
    switch (agentType) {
      case 'data-processing':
        // Data processing can use local AI for small datasets
        return payloadSize < 1000;
      
      case 'regulatory-compliance':
        // Regulatory tasks usually need more context, prefer cloud
        return false;
      
      case 'predictive-analytics':
        // Predictive tasks usually need more power, prefer cloud
        return false;
      
      default:
        return false;
    }
  }
}

export const aiAgentOrchestrator = new AIAgentOrchestrator();
