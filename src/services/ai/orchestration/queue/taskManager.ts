import { AgentTask, AgentType } from '../types/agentTypes';

/**
 * TaskManager - Handles the task queue and status updates
 */
export class TaskManager {
  private taskQueue: AgentTask[] = [];
  private isProcessing: boolean = false;
  
  /**
   * Create a new task and add it to the queue
   */
  createTask(
    agentType: AgentType, 
    payload: any, 
    priority: 'high' | 'medium' | 'low' = 'medium',
    useLocalAI: boolean = false
  ): string {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
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
    
    return taskId;
  }
  
  /**
   * Get all tasks in the queue
   */
  getAllTasks(): AgentTask[] {
    return [...this.taskQueue];
  }
  
  /**
   * Get a task by ID
   */
  getTask(taskId: string): AgentTask | undefined {
    return this.taskQueue.find(task => task.id === taskId);
  }
  
  /**
   * Get the next pending task
   */
  getNextPendingTask(): AgentTask | undefined {
    return this.taskQueue.find(task => task.status === 'pending');
  }
  
  /**
   * Update a task's status and details
   */
  updateTask(
    taskId: string, 
    updates: Partial<Omit<AgentTask, 'id' | 'agentType' | 'createdAt'>>
  ): AgentTask | undefined {
    const taskIndex = this.taskQueue.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return undefined;
    
    const updatedTask = {
      ...this.taskQueue[taskIndex],
      ...updates
    };
    
    this.taskQueue[taskIndex] = updatedTask;
    return updatedTask;
  }
  
  /**
   * Mark a task as processing
   */
  markTaskAsProcessing(taskId: string): AgentTask | undefined {
    return this.updateTask(taskId, { status: 'processing' });
  }
  
  /**
   * Mark a task as completed
   */
  markTaskAsCompleted(taskId: string, result: any): AgentTask | undefined {
    return this.updateTask(taskId, { 
      status: 'completed', 
      result,
      completedAt: new Date()
    });
  }
  
  /**
   * Mark a task as failed
   */
  markTaskAsFailed(taskId: string, error: string): AgentTask | undefined {
    return this.updateTask(taskId, { 
      status: 'failed', 
      error 
    });
  }
  
  /**
   * Sort the task queue based on priority
   */
  sortTaskQueue(): void {
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
   * Check if tasks are currently being processed
   */
  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
  
  /**
   * Set the processing status
   */
  setProcessingStatus(status: boolean): void {
    this.isProcessing = status;
  }
}
