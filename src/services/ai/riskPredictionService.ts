
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RiskFactor {
  name: string;
  impact: number;
  recommendation: string;
}

export interface RiskPrediction {
  id?: string;
  category: string;
  score: number;
  confidence: number;
  factors: RiskFactor[];
  trend: 'improving' | 'declining' | 'stable';
  details: string;
  isCritical: boolean;
  date?: string;
}

export interface RiskAnalysisRequest {
  userId: string;
  category: string;
  dataPoints: Array<{
    metric: string;
    value: number;
    date: string;
  }>;
  complianceFrameworks: string[];
  industryBenchmarks?: Record<string, number>;
}

class RiskPredictionService {
  /**
   * Generate a new ESG risk prediction
   */
  async generatePrediction(request: RiskAnalysisRequest): Promise<RiskPrediction | null> {
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('esg-risk-analysis', {
        body: request
      });

      if (error) {
        console.error('Error generating risk prediction:', error);
        toast.error('Failed to generate risk prediction');
        return null;
      }

      return data.prediction;
    } catch (error) {
      console.error('Error in risk prediction service:', error);
      toast.error('An error occurred while analyzing ESG risks');
      return null;
    }
  }

  /**
   * Get all risk predictions for the current user
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

      return data.map(item => ({
        id: item.id,
        category: item.risk_category,
        score: item.risk_score,
        confidence: item.confidence_level,
        factors: item.prediction_details.factors || [],
        trend: item.prediction_details.trend || 'stable',
        details: item.prediction_details.details || '',
        isCritical: item.is_critical,
        date: new Date(item.prediction_date).toISOString()
      }));
    } catch (error) {
      console.error('Error fetching risk predictions:', error);
      toast.error('Failed to load risk predictions');
      return [];
    }
  }

  /**
   * Get the most recent risk prediction for a specific category
   */
  async getLatestPrediction(category: string): Promise<RiskPrediction | null> {
    try {
      const { data, error } = await supabase
        .from('esg_risk_predictions')
        .select('*')
        .eq('risk_category', category)
        .order('prediction_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no predictions exist yet, this isn't an error
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return {
        id: data.id,
        category: data.risk_category,
        score: data.risk_score,
        confidence: data.confidence_level,
        factors: data.prediction_details.factors || [],
        trend: data.prediction_details.trend || 'stable',
        details: data.prediction_details.details || '',
        isCritical: data.is_critical,
        date: new Date(data.prediction_date).toISOString()
      };
    } catch (error) {
      console.error(`Error fetching latest ${category} prediction:`, error);
      return null;
    }
  }
}

export const riskPredictionService = new RiskPredictionService();
