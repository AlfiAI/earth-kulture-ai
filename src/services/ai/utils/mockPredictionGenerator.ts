
import { ESGRiskPredictionRequest } from "../types/riskPredictionTypes";

/**
 * Generates a mock prediction for demonstration purposes
 */
export function generateMockPrediction(request: ESGRiskPredictionRequest) {
  return {
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
          impact: 0.8,
          recommendation: 'Review historical data patterns to understand the trend trajectory.'
        },
        {
          name: 'Seasonal Patterns',
          impact: 0.5,
          recommendation: 'Adjust for seasonal variations in your data reporting.'
        },
        {
          name: 'Regulatory Changes',
          impact: -0.3,
          recommendation: 'Monitor upcoming regulatory changes that may impact compliance.'
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
}
