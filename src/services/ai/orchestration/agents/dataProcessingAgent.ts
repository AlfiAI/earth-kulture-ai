
import { deepseekR1Service } from '../../deepseekR1Service';
import { LocalAIProcessor } from '../local/localAIProcessor';

export class DataProcessingAgent {
  private localAIProcessor: LocalAIProcessor;
  
  constructor(localAIProcessor: LocalAIProcessor) {
    this.localAIProcessor = localAIProcessor;
  }
  
  /**
   * Process data using cloud-based AI
   */
  async processWithCloudAI(payload: any): Promise<any> {
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
   * Process data using local AI
   */
  async processWithLocalAI(payload: any): Promise<any> {
    try {
      const systemPrompt = `You are a data processing specialist. Analyze this data and identify quality issues. 
      Be brief and focus on the most important findings.`;
      
      const result = await this.localAIProcessor.processQuery(
        systemPrompt,
        JSON.stringify(payload),
        0.3,
        800
      );
      
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
}
