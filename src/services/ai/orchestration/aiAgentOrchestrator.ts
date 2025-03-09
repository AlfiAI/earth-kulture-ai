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
  useLocalAI?: boolean;
}

// Local AI processing configuration
interface LocalAIConfig {
  enabled: boolean;
  url: string;
  modelName: string;
  available: boolean | null;
  lastCheck: number;
}

/**
 * AI Agent Orchestrator - Manages communication between specialized AI agents
 */
class AIAgentOrchestrator {
  private taskQueue: AgentTask[] = [];
  private isProcessing: boolean = false;
  private apiFailureCount: number = 0;
  private readonly API_FALLBACK_THRESHOLD = 3;
  
  // Local AI configuration
  private localAI: LocalAIConfig = {
    enabled: true,
    url: "http://localhost:11434/api/chat",
    modelName: "llama3",
    available: null,
    lastCheck: 0
  };
  
  /**
   * Submit a task to be processed by a specific AI agent
   */
  async submitTask(
    agentType: AgentType, 
    payload: any, 
    priority: 'high' | 'medium' | 'low' = 'medium',
    forceLocalAI: boolean = false
  ): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Check if we should use local AI
    const useLocalAI = forceLocalAI || 
                       (await this.shouldUseLocalAI(agentType, payload, priority));
    
    const task: AgentTask = {
      id: taskId,
      agentType,
      payload,
      priority,
      status: 'pending',
      createdAt: new Date(),
      useLocalAI
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
        
        // Reset API failure count on success if using cloud AI
        if (!task.useLocalAI) {
          this.apiFailureCount = 0;
        }
      } catch (error) {
        console.error(`Error processing task ${task.id}:`, error);
        task.status = 'failed';
        task.error = error.message;
        
        // Increment API failure count if using cloud AI
        if (!task.useLocalAI) {
          this.apiFailureCount++;
        }
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
    const { agentType, payload, useLocalAI } = task;
    
    // Route to specific agent based on type
    switch (agentType) {
      case 'data-processing':
        return useLocalAI ? 
               this.processDataTaskLocally(payload) : 
               this.processDataTask(payload);
      
      case 'regulatory-compliance':
        return useLocalAI ? 
               this.processRegulatoryTaskLocally(payload) : 
               this.processRegulatoryTask(payload);
      
      case 'predictive-analytics':
        return useLocalAI ? 
               this.processPredictiveTaskLocally(payload) : 
               this.processPredictiveTask(payload);
      
      default:
        throw new Error(`Unknown agent type: ${agentType}`);
    }
  }
  
  /**
   * Check if local AI is available
   */
  private async isLocalAIAvailable(): Promise<boolean> {
    // Cache the check for 5 minutes
    const now = Date.now();
    if (this.localAI.available !== null && (now - this.localAI.lastCheck) < 5 * 60 * 1000) {
      return this.localAI.available;
    }
    
    try {
      const response = await fetch(this.localAI.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.localAI.modelName,
          messages: [{ role: "user", content: "hello" }],
          max_tokens: 1
        }),
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      this.localAI.available = response.ok;
      this.localAI.lastCheck = now;
      return this.localAI.available;
    } catch (error) {
      console.error("Error checking local AI availability:", error);
      this.localAI.available = false;
      this.localAI.lastCheck = now;
      return false;
    }
  }
  
  /**
   * Determine if we should use local AI based on task type and payload
   */
  private async shouldUseLocalAI(agentType: AgentType, payload: any, priority: string): Promise<boolean> {
    // If local AI is not enabled, don't use it
    if (!this.localAI.enabled) return false;
    
    // Check if local AI is available
    if (!(await this.isLocalAIAvailable())) return false;
    
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
   * Local version of Data Processing Agent
   */
  private async processDataTaskLocally(payload: any): Promise<any> {
    try {
      const systemPrompt = `You are a data processing specialist. Analyze this data and identify quality issues. 
      Be brief and focus on the most important findings.`;
      
      const response = await fetch(this.localAI.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.localAI.modelName,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: JSON.stringify(payload) }
          ],
          temperature: 0.3,
          max_tokens: 800
        })
      });
      
      if (!response.ok) {
        throw new Error(`Local AI responded with status ${response.status}`);
      }
      
      const data = await response.json();
      const result = data.choices[0].message.content;
      
      // Attempt to parse as JSON, return as-is if not valid
      try {
        return { 
          processedData: result,
          processedLocally: true,
          issues: ["Processed with simplified local model"]
        };
      } catch {
        return { 
          processedData: result,
          processedLocally: true
        };
      }
    } catch (error) {
      console.error('Error in local data processing:', error);
      throw new Error(`Local data processing failed: ${error.message}`);
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
   * Local version of Regulatory Compliance Agent
   */
  private async processRegulatoryTaskLocally(payload: any): Promise<any> {
    try {
      const systemPrompt = `You are a regulatory compliance specialist. 
      Review this information and identify key requirements. Focus on the most important actions needed.`;
      
      const response = await fetch(this.localAI.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.localAI.modelName,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: JSON.stringify(payload) }
          ],
          temperature: 0.3,
          max_tokens: 800
        })
      });
      
      if (!response.ok) {
        throw new Error(`Local AI responded with status ${response.status}`);
      }
      
      const data = await response.json();
      return { 
        regulatoryAnalysis: data.choices[0].message.content,
        processedLocally: true,
        disclaimer: "This is a simplified analysis. For critical compliance decisions, please use the full cloud-based analysis."
      };
    } catch (error) {
      console.error('Error in local regulatory processing:', error);
      throw new Error(`Local regulatory processing failed: ${error.message}`);
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
  
  /**
   * Local version of Predictive Analytics Agent
   */
  private async processPredictiveTaskLocally(payload: any): Promise<any> {
    try {
      const systemPrompt = `You are a data analyst specializing in ESG trends. 
      Based on this data, provide a brief analysis of potential future trends. Focus on the most likely outcomes.`;
      
      const response = await fetch(this.localAI.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.localAI.modelName,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: JSON.stringify(payload) }
          ],
          temperature: 0.5,
          max_tokens: 800
        })
      });
      
      if (!response.ok) {
        throw new Error(`Local AI responded with status ${response.status}`);
      }
      
      const data = await response.json();
      return { 
        predictiveInsights: data.choices[0].message.content,
        processedLocally: true,
        confidenceLevel: "medium",
        disclaimer: "This is a simplified prediction based on limited processing. For high-stakes decisions, please use the full cloud-based analysis."
      };
    } catch (error) {
      console.error('Error in local predictive analysis:', error);
      throw new Error(`Local predictive analysis failed: ${error.message}`);
    }
  }
}

export const aiAgentOrchestrator = new AIAgentOrchestrator();
