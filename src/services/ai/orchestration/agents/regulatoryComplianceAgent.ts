
import { deepseekR1Service } from '../../deepseekR1Service';
import { LocalAIProcessor } from '../local/localAIProcessor';

export class RegulatoryComplianceAgent {
  private localAIProcessor: LocalAIProcessor;
  
  constructor(localAIProcessor: LocalAIProcessor) {
    this.localAIProcessor = localAIProcessor;
  }
  
  /**
   * Process regulatory task using cloud-based AI
   */
  async processWithCloudAI(payload: any): Promise<any> {
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
   * Process regulatory task using local AI
   */
  async processWithLocalAI(payload: any): Promise<any> {
    try {
      const systemPrompt = `You are a regulatory compliance specialist. 
      Review this information and identify key requirements. Focus on the most important actions needed.`;
      
      const result = await this.localAIProcessor.processQuery(
        systemPrompt,
        JSON.stringify(payload),
        0.3,
        800
      );
      
      return { 
        regulatoryAnalysis: result,
        processedLocally: true,
        disclaimer: "This is a simplified analysis. For critical compliance decisions, please use the full cloud-based analysis."
      };
    } catch (error) {
      console.error('Error in local regulatory processing:', error);
      throw new Error(`Local regulatory processing failed: ${error.message}`);
    }
  }
}
