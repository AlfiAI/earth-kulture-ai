
import { RiskPrediction, RiskFactor, RiskPredictionDetail } from "../types/riskPredictionTypes";

/**
 * Utility functions to map risk prediction data between database and domain models
 */

/**
 * Maps a database record to a RiskPrediction domain object
 */
export function mapDbRecordToRiskPrediction(record: any): RiskPrediction {
  const predictionDetails = record.prediction_details as Record<string, any>;
  
  return {
    id: record.id,
    category: record.risk_category,
    metricName: predictionDetails?.metric_name || 'Unknown Metric',
    riskScore: record.risk_score,
    confidenceLevel: record.confidence_level,
    prediction: predictionDetails?.prediction || 'No prediction available',
    date: new Date(record.prediction_date).toISOString(),
    isCritical: record.is_critical,
    factors: Array.isArray(predictionDetails?.factors) 
      ? predictionDetails.factors.map((f: any) => mapToRiskFactor(f))
      : [],
    trend: (predictionDetails?.trend as 'increasing' | 'decreasing' | 'stable') || 'stable',
    details: Array.isArray(predictionDetails?.details) 
      ? predictionDetails.details.map((d: any) => mapToRiskDetail(d))
      : []
  };
}

/**
 * Maps an object to a RiskFactor
 */
function mapToRiskFactor(data: any): RiskFactor {
  return {
    name: data.name || '',
    impact: data.impact || 0,
    recommendation: data.recommendation || ''
  };
}

/**
 * Maps an object to a RiskPredictionDetail
 */
function mapToRiskDetail(data: any): RiskPredictionDetail {
  return {
    key: data.key || '',
    value: data.value || '',
    icon: data.icon
  };
}
