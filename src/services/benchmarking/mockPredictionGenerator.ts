
import { ESGPrediction, PredictionCategory } from './types';

export class MockPredictionGenerator {
  /**
   * Generate mock predictions for demo purposes
   */
  static getMockPredictions(category: PredictionCategory): ESGPrediction[] {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setMonth(now.getMonth() + 3);
    
    switch (category) {
      case 'esg':
        return [
          {
            id: '1',
            category: 'esg',
            metricName: 'Overall ESG Score',
            currentValue: 72,
            predictedValue: 78,
            predictedDate: futureDate.toISOString(),
            confidence: 0.85,
            trendDirection: 'up',
            factors: [
              { name: 'Renewable energy transition', impact: 0.4 },
              { name: 'Supply chain transparency', impact: 0.3 },
              { name: 'Waste reduction initiatives', impact: 0.2 },
              { name: 'Carbon offset programs', impact: 0.1 }
            ],
            createdAt: now.toISOString()
          },
          {
            id: '2',
            category: 'esg',
            metricName: 'Social Score',
            currentValue: 65,
            predictedValue: 70,
            predictedDate: futureDate.toISOString(),
            confidence: 0.75,
            trendDirection: 'up',
            factors: [
              { name: 'Diversity initiatives', impact: 0.35 },
              { name: 'Community engagement', impact: 0.25 },
              { name: 'Employee welfare programs', impact: 0.4 }
            ],
            createdAt: now.toISOString()
          }
        ];
        
      case 'carbon':
        return [
          {
            id: '3',
            category: 'carbon',
            metricName: 'Total Carbon Emissions',
            currentValue: 1250,
            predictedValue: 1100,
            predictedDate: futureDate.toISOString(),
            confidence: 0.8,
            trendDirection: 'down',
            factors: [
              { name: 'Energy efficiency measures', impact: -0.25 },
              { name: 'Remote work policies', impact: -0.15 },
              { name: 'Sustainable transportation', impact: -0.2 },
              { name: 'Renewable energy adoption', impact: -0.4 }
            ],
            createdAt: now.toISOString()
          }
        ];
        
      case 'compliance':
        return [
          {
            id: '4',
            category: 'compliance',
            metricName: 'Regulatory Compliance Score',
            currentValue: 85,
            predictedValue: 92,
            predictedDate: futureDate.toISOString(),
            confidence: 0.9,
            trendDirection: 'up',
            factors: [
              { name: 'New policy implementation', impact: 0.3 },
              { name: 'Staff compliance training', impact: 0.25 },
              { name: 'Automated monitoring systems', impact: 0.45 }
            ],
            createdAt: now.toISOString()
          },
          {
            id: '5',
            category: 'compliance',
            metricName: 'CSRD Readiness',
            currentValue: 70,
            predictedValue: 90,
            predictedDate: futureDate.toISOString(),
            confidence: 0.85,
            trendDirection: 'up',
            factors: [
              { name: 'Data collection improvements', impact: 0.4 },
              { name: 'Reporting structure updates', impact: 0.35 },
              { name: 'Staff training', impact: 0.25 }
            ],
            createdAt: now.toISOString()
          }
        ];
        
      case 'financial':
        return [
          {
            id: '6',
            category: 'financial',
            metricName: 'ESG-Related Cost Savings',
            currentValue: 125000,
            predictedValue: 175000,
            predictedDate: futureDate.toISOString(),
            confidence: 0.7,
            trendDirection: 'up',
            factors: [
              { name: 'Energy efficiency measures', impact: 0.35 },
              { name: 'Waste reduction', impact: 0.3 },
              { name: 'Tax incentives', impact: 0.35 }
            ],
            createdAt: now.toISOString()
          },
          {
            id: '7',
            category: 'financial',
            metricName: 'Sustainable Investment Returns',
            currentValue: 85000,
            predictedValue: 110000,
            predictedDate: futureDate.toISOString(),
            confidence: 0.65,
            trendDirection: 'up',
            factors: [
              { name: 'Green bonds performance', impact: 0.4 },
              { name: 'ESG fund yields', impact: 0.35 },
              { name: 'Market trends', impact: 0.25 }
            ],
            createdAt: now.toISOString()
          }
        ];
        
      default:
        return [];
    }
  }
}
