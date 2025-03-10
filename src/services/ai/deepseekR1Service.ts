
import { MessageProps } from '@/components/ai/Message';
import { deepseekAPIService } from './deepseek/services/deepseekAPIService';
import { categorizeIntent } from './deepseek/utils/deepseekUtils';
import { IntentCategory } from './deepseek/types/deepseekTypes';
import { toast } from "sonner";

/**
 * DeepSeek R1 Service for AI-powered ESG insights with advanced caching and optimizations
 */
class DeepseekR1Service {
  // Track rate limiting to prevent API overuse
  private requestCount: number = 0;
  private lastResetTime: number = Date.now();
  private readonly MAX_REQUESTS_PER_MINUTE: number = 20;
  private readonly RATE_LIMIT_RESET_INTERVAL: number = 60 * 1000; // 1 minute
  
  // Keep track of pending requests to batch similar ones
  private pendingRequests: Map<string, Promise<string>> = new Map();
  
  constructor() {
    console.log('DeepSeek R1 Service initialized');
    // Reset request count every minute
    setInterval(() => {
      this.requestCount = 0;
      this.lastResetTime = Date.now();
    }, this.RATE_LIMIT_RESET_INTERVAL);
  }
  
  /**
   * Process query using DeepSeek R1 API with advanced caching and rate limiting
   */
  async processQuery(query: string, previousMessages: MessageProps[] = [], customSystemPrompt?: string): Promise<string> {
    console.log('DeepSeek R1 processing query:', query.substring(0, 50) + '...');
    
    // Implement rate limiting
    if (this.isRateLimited()) {
      const waitTime = this.calculateWaitTime();
      if (waitTime > 5000) {
        // If wait time is more than 5 seconds, use fallback processing
        console.log(`Rate limited, using fallback processing. Wait time: ${waitTime}ms`);
        return this.generateFallbackResponse(query);
      } else {
        // Wait for rate limit to reset
        console.log(`Rate limited, waiting ${waitTime}ms before trying again`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    // Generate a request key for deduplication
    const requestKey = this.generateRequestKey(query, previousMessages, customSystemPrompt);
    
    // Check if this exact request is already in progress
    if (this.pendingRequests.has(requestKey)) {
      console.log('Identical request already in progress, reusing result');
      return this.pendingRequests.get(requestKey) as Promise<string>;
    }
    
    // Create the promise for this request
    const requestPromise = this.executeRequest(query, previousMessages, customSystemPrompt);
    
    // Store in pending requests map
    this.pendingRequests.set(requestKey, requestPromise);
    
    // When complete, remove from pending requests
    requestPromise.finally(() => {
      this.pendingRequests.delete(requestKey);
    });
    
    return requestPromise;
  }
  
  /**
   * Execute the actual API request
   */
  private async executeRequest(query: string, previousMessages: MessageProps[] = [], customSystemPrompt?: string): Promise<string> {
    try {
      console.log('Executing DeepSeek R1 API request');
      // Increment request count for rate limiting
      this.requestCount++;
      
      // Process the query through the API service
      return await deepseekAPIService.processQuery(query, previousMessages, customSystemPrompt);
    } catch (error) {
      console.error('Error in DeepSeek R1 service:', error);
      toast.error('AI service connection issue. Using fallback mode.');
      
      // Generate fallback response if API fails
      return this.generateFallbackResponse(query);
    }
  }
  
  /**
   * Generate a unique key for a request to enable deduplication
   */
  private generateRequestKey(query: string, previousMessages: MessageProps[] = [], customSystemPrompt?: string): string {
    // Create a simplified representation of the previous messages
    const messagesKey = previousMessages.map(msg => `${msg.sender}:${msg.content.substring(0, 50)}`).join('|');
    
    // Combine with query and prompt to create a unique key
    return `${query}|${messagesKey}|${customSystemPrompt?.substring(0, 100) || ''}`;
  }
  
  /**
   * Check if we're currently rate limited
   */
  private isRateLimited(): boolean {
    return this.requestCount >= this.MAX_REQUESTS_PER_MINUTE;
  }
  
  /**
   * Calculate wait time before next request
   */
  private calculateWaitTime(): number {
    const elapsedTime = Date.now() - this.lastResetTime;
    const remainingTime = this.RATE_LIMIT_RESET_INTERVAL - elapsedTime;
    return Math.max(0, remainingTime);
  }
  
  /**
   * Fallback response generator when API is unavailable
   */
  private generateFallbackResponse(query: string): string {
    console.log('Generating fallback response for:', query.substring(0, 50) + '...');
    // Determine the intent of the query
    const intent = this.categorizeIntent(query);
    
    // Generate a generic response based on intent
    switch (intent) {
      case 'compliance':
        return "I'm currently unable to access the latest regulatory information. Please try again later for up-to-date regulatory insights.";
      
      case 'reporting':
        return "I can help with ESG reporting, but can't generate detailed reports right now. Please try again later or provide specific reporting questions.";
      
      case 'benchmarking':
        return "I'm unable to perform detailed data analysis at the moment. If you have specific questions about your data, please try again later.";
      
      case 'carbon':
        return "Based on general best practices, organizations should focus on measuring and reducing carbon emissions, improving energy efficiency, and enhancing transparency in ESG reporting.";
      
      default:
        return "I'm currently operating in a limited capacity. For the best experience with detailed insights, please try again later.";
    }
  }
  
  /**
   * Categorize user intent based on query content
   * Exposed for use by other services
   */
  categorizeIntent(query: string): IntentCategory {
    return categorizeIntent(query);
  }
}

export const deepseekR1Service = new DeepseekR1Service();
