
import { toast } from "sonner";
import { deepseekR1Service } from '../deepseekR1Service';

// Define the types of specialized AI agents
type AgentType = 'data-processing' | 'regulatory-compliance' | 'predictive-analytics';

// Agent task interface
interface AgentTask {
  id: string;
  agentType: AgentType;
  payload: any;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * AI Agent Orchestrator - Manages communication between specialized AI agents
 */
class AIAgentOrchestrator {
  private taskQueue: AgentTask[] = [];
  private isProcessing: boolean = false;
  
  /**
   * Submit a task to be processed by a specific AI agent
   */
  async submitTask(agentType: AgentType, payload: any, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const task: AgentTask = {
      id: taskId,
      agentType,
      payload,
      priority,
      status: 'pending',
      createdAt: new Date()
    };
    
    this.taskQueue.push(task);
    this.sortTaskQueue();
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.processTasks();
    }
    
    return taskId;
  }
  
  /**
   * Get the status of a specific task
   */
  getTaskStatus(taskId: string): AgentTask | undefined {
    return this.taskQueue.find(task => task.id === taskId);
  }
  
  /**
   * Sort the task queue based on priority
   */
  private sortTaskQueue(): void {
    const priorityValues = { 'high': 0, 'medium': 1, 'low': 2 };
    this.taskQueue.sort((a, b) => {
      // First sort by priority
      const priorityDiff = priorityValues[a.priority] - priorityValues[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by creation time
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }
  
  /**
   * Process tasks in the queue
   */
  private async processTasks(): Promise<void> {
    if (this.taskQueue.length === 0 || this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      // Get the next task
      const task = this.taskQueue.find(task => task.status === 'pending');
      
      if (!task) {
        this.isProcessing = false;
        return;
      }
      
      task.status = 'processing';
      
      // Route to appropriate agent
      try {
        const result = await this.routeTaskToAgent(task);
        task.status = 'completed';
        task.result = result;
        task.completedAt = new Date();
      } catch (error) {
        console.error(`Error processing task ${task.id}:`, error);
        task.status = 'failed';
        task.error = error.message;
      }
      
      // Continue processing remaining tasks
      this.isProcessing = false;
      this.processTasks();
    } catch (error) {
      console.error('Error in task processing:', error);
      this.isProcessing = false;
    }
  }
  
  /**
   * Route a task to the appropriate specialized agent
   */
  private async routeTaskToAgent(task: AgentTask): Promise<any> {
    const { agentType, payload } = task;
    
    // Route to specific agent based on type
    switch (agentType) {
      case 'data-processing':
        return this.processDataTask(payload);
      
      case 'regulatory-compliance':
        return this.processRegulatoryTask(payload);
      
      case 'predictive-analytics':
        return this.processPredictiveTask(payload);
      
      default:
        throw new Error(`Unknown agent type: ${agentType}`);
    }
  }
  
  /**
   * Data Processing Agent - Handles data validation, cleansing, and structuring
   */
  private async processDataTask(payload: any): Promise<any> {
    // Construct a specialized prompt for data processing tasks
    const systemPrompt = `You are an AI data processing specialist for ESG data. 
    Analyze the provided data for quality issues, inconsistencies, and suggest improvements.
    Format your response as a structured JSON with 'issues', 'recommendations', and 'processedData' fields.`;
    
    try {
      const result = await deepseekR1Service.processQuery(
        JSON.stringify(payload),
        [],
        systemPrompt
      );
      
      // Parse the result if it's in JSON format
      try {
        return JSON.parse(result);
      } catch {
        // If not valid JSON, return as is
        return { processedData: result };
      }
    } catch (error) {
      console.error('Error in data processing agent:', error);
      throw new Error(`Data processing failed: ${error.message}`);
    }
  }
  
  /**
   * Regulatory Compliance Agent - Monitors updates and recommends actions
   */
  private async processRegulatoryTask(payload: any): Promise<any> {
    const systemPrompt = `You are an AI regulatory compliance specialist for ESG regulations.
    Analyze the provided information about regulatory changes and provide actionable insights.
    Format your response as a structured JSON with 'impacts', 'requiredActions', and 'timeline' fields.`;
    
    try {
      const result = await deepseekR1Service.processQuery(
        JSON.stringify(payload), 
        [],
        systemPrompt
      );
      
      // Parse the result if it's in JSON format
      try {
        return JSON.parse(result);
      } catch {
        // If not valid JSON, return as is
        return { regulatoryAnalysis: result };
      }
    } catch (error) {
      console.error('Error in regulatory compliance agent:', error);
      throw new Error(`Regulatory analysis failed: ${error.message}`);
    }
  }
  
  /**
   * Predictive Analytics Agent - Forecasts trends and risks
   */
  private async processPredictiveTask(payload: any): Promise<any> {
    const systemPrompt = `You are an AI predictive analytics specialist for ESG data.
    Analyze the provided historical data to forecast trends, identify potential risks, and suggest mitigation strategies.
    Format your response as a structured JSON with 'predictions', 'risks', 'opportunities', and 'confidenceScores' fields.`;
    
    try {
      const result = await deepseekR1Service.processQuery(
        JSON.stringify(payload),
        [],
        systemPrompt
      );
      
      // Parse the result if it's in JSON format
      try {
        return JSON.parse(result);
      } catch {
        // If not valid JSON, return as is
        return { predictiveInsights: result };
      }
    } catch (error) {
      console.error('Error in predictive analytics agent:', error);
      throw new Error(`Predictive analysis failed: ${error.message}`);
    }
  }
}

export const aiAgentOrchestrator = new AIAgentOrchestrator();
