
import { deepseekR1Service } from '@/services/ai/deepseekR1Service';

export interface PredictionParameters {
  timeframe: string;
  confidenceLevel: number;
}

export interface PredictionResult {
  predictedValue: number;
  explanation: string;
}

export interface PredictiveAnalyticsAgent {
  generatePrediction(data: any, parameters: PredictionParameters): Promise<PredictionResult>;
  processWithLocalAI?(payload: any): Promise<any>;
  processWithCloudAI?(payload: any): Promise<any>;
}

class PredictiveAnalyticsAgentImpl implements PredictiveAnalyticsAgent {
  // Required by orchestrator
  async processWithLocalAI(payload: any): Promise<any> {
    if (payload.data && payload.parameters) {
      return this.generatePrediction(payload.data, payload.parameters);
    }
    return { predictedValue: 0, explanation: "Invalid payload for local AI processing" };
  }

  // Required by orchestrator
  async processWithCloudAI(payload: any): Promise<any> {
    if (payload.data && payload.parameters) {
      return this.generatePrediction(payload.data, payload.parameters);
    }
    return { predictedValue: 0, explanation: "Invalid payload for cloud AI processing" };
  }

  async generatePrediction(data: any, parameters: PredictionParameters): Promise<PredictionResult> {
    try {
      // Generate prediction using AI
      const predictionAnalysis = await deepseekR1Service.processQuery(
        `Generate a prediction based on the following data: ${JSON.stringify(data)}. Parameters: ${JSON.stringify(parameters)}`
      );

      // Parse the AI's response
      const parsedResult: PredictionResult = {
        predictedValue: parseFloat(predictionAnalysis),
        explanation: 'AI-generated prediction based on provided data and parameters.'
      };

      return parsedResult;
    } catch (error) {
      console.error("Error in predictive analytics agent:", error);
      throw error;
    }
  }
}

export const predictiveAnalyticsAgent: PredictiveAnalyticsAgent = new PredictiveAnalyticsAgentImpl();
