
import { deepseekR1Service } from '../../deepseekR1Service';
import { LocalAIProcessor } from '../local/localAIProcessor';

export class PredictiveAnalyticsAgent {
  private localAIProcessor: LocalAIProcessor;
  
  constructor(localAIProcessor: LocalAIProcessor) {
    this.localAIProcessor = localAIProcessor;
  }
  
  /**
   * Process predictive analytics task using cloud-based AI
   */
  async processWithCloudAI(payload: any): Promise<any> {
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
   * Process predictive analytics task using local AI
   */
  async processWithLocalAI(payload: any): Promise<any> {
    try {
      const systemPrompt = `You are a data analyst specializing in ESG trends. 
      Based on this data, provide a brief analysis of potential future trends. Focus on the most likely outcomes.`;
      
      const result = await this.localAIProcessor.processQuery(
        systemPrompt,
        JSON.stringify(payload),
        0.5,
        800
      );
      
      return { 
        predictiveInsights: result,
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
