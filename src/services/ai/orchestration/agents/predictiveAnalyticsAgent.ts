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
}

class PredictiveAnalyticsAgentImpl implements PredictiveAnalyticsAgent {
  async generatePrediction(data: any, parameters: PredictionParameters): Promise<PredictionResult> {
    try {
      // Generate prediction using AI
      const predictionAnalysis = await deepseekR1Service.processQuery(
        `Generate a prediction based on the following data: ${JSON.stringify(data)}. Parameters: ${JSON.stringify(parameters)}`,
        []  // Empty conversation context
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
