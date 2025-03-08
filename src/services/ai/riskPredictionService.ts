
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RiskPrediction, ESGRiskPredictionRequest } from "./types/riskPredictionTypes";
import { mapDbRecordToRiskPrediction } from "./utils/riskPredictionMappers";
import { generateMockPrediction } from "./utils/mockPredictionGenerator";

/**
 * Service for managing ESG risk predictions
 */
class RiskPredictionService {
  /**
   * Get predictions for the current user
   */
  async getUserPredictions(): Promise<RiskPrediction[]> {
    try {
      const { data, error } = await supabase
        .from('esg_risk_predictions')
        .select('*')
        .order('prediction_date', { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(item => mapDbRecordToRiskPrediction(item));
    } catch (error) {
      console.error('Error fetching risk predictions:', error);
      toast.error('Failed to load risk predictions');
      return [];
    }
  }

  /**
   * Generate a new risk prediction
   */
  async generatePrediction(request: ESGRiskPredictionRequest): Promise<RiskPrediction | null> {
    try {
      // This is a simplified implementation for demonstration
      // In a real implementation, this would call an ML model
      const mockPrediction = generateMockPrediction(request);

      const { data, error } = await supabase
        .from('esg_risk_predictions')
        .insert(mockPrediction)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Risk prediction generated successfully');

      // Convert the format to match our application model
      return mapDbRecordToRiskPrediction(data);
    } catch (error) {
      console.error('Error generating risk prediction:', error);
      toast.error('Failed to generate risk prediction');
      return null;
    }
  }
}

export const riskPredictionService = new RiskPredictionService();
export { RiskPrediction, RiskFactor, RiskPredictionDetail, ESGRiskPredictionRequest } from './types/riskPredictionTypes';
