
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RiskFactor {
  name: string;
  impact: number; // -1 to 1 range, negative means reducing the risk
}

export interface RiskPredictionDetail {
  key: string;
  value: string | number;
  icon?: string;
}

export interface RiskPrediction {
  id: string;
  category: string;
  metricName: string;
  riskScore: number;
  confidenceLevel: number;
  prediction: string;
  date: string;
  isCritical: boolean;
  factors: RiskFactor[];
  trend: 'increasing' | 'decreasing' | 'stable';
  details: RiskPredictionDetail[];
}

export interface ESGRiskPredictionRequest {
  userId: string;
  category: string;
  dataPoints: {
    metric: string;
    value: number;
    date: string;
  }[];
  complianceFrameworks: string[];
  industryBenchmarks: Record<string, number>;
}

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

      return data.map(item => ({
        id: item.id,
        category: item.risk_category,
        metricName: item.prediction_details.metric_name || 'Unknown Metric',
        riskScore: item.risk_score,
        confidenceLevel: item.confidence_level,
        prediction: item.prediction_details.prediction || 'No prediction available',
        date: new Date(item.prediction_date).toISOString(),
        isCritical: item.is_critical,
        factors: Array.isArray(item.prediction_details.factors) 
          ? item.prediction_details.factors 
          : [],
        trend: (item.prediction_details.trend as 'increasing' | 'decreasing' | 'stable') || 'stable',
        details: Array.isArray(item.prediction_details.details) 
          ? item.prediction_details.details 
          : []
      }));
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
      const mockPrediction = {
        user_id: request.userId,
        risk_category: request.category,
        risk_score: Math.random() * 100,
        confidence_level: 0.7 + (Math.random() * 0.3),
        model_version: '1.0.0',
        is_critical: Math.random() > 0.7,
        prediction_details: {
          metric_name: request.dataPoints[0]?.metric || 'Carbon Emissions',
          prediction: 'Based on current trends, this metric will exceed compliance thresholds within 3 months.',
          factors: [
            {
              name: 'Historical Trend',
              impact: 0.8
            },
            {
              name: 'Seasonal Patterns',
              impact: 0.5
            },
            {
              name: 'Regulatory Changes',
              impact: -0.3
            }
          ],
          trend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
          details: [
            {
              key: 'Current Value',
              value: request.dataPoints[request.dataPoints.length - 1]?.value || 0
            },
            {
              key: 'Predicted Future Value',
              value: (request.dataPoints[request.dataPoints.length - 1]?.value || 0) * 1.2
            },
            {
              key: 'Industry Benchmark',
              value: Object.values(request.industryBenchmarks)[0] || 0
            }
          ]
        }
      };

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
      return {
        id: data.id,
        category: data.risk_category,
        metricName: data.prediction_details.metric_name || 'Unknown Metric',
        riskScore: data.risk_score,
        confidenceLevel: data.confidence_level,
        prediction: data.prediction_details.prediction || 'No prediction available',
        date: new Date(data.prediction_date).toISOString(),
        isCritical: data.is_critical,
        factors: Array.isArray(data.prediction_details.factors) 
          ? data.prediction_details.factors 
          : [],
        trend: (data.prediction_details.trend as 'increasing' | 'decreasing' | 'stable') || 'stable',
        details: Array.isArray(data.prediction_details.details) 
          ? data.prediction_details.details 
          : []
      };
    } catch (error) {
      console.error('Error generating risk prediction:', error);
      toast.error('Failed to generate risk prediction');
      return null;
    }
  }
}

export const riskPredictionService = new RiskPredictionService();
