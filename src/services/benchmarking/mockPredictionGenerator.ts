
import { ESGPrediction, PredictionCategory } from './types';

export class MockPredictionGenerator {
  static getMockPredictions(category: PredictionCategory): ESGPrediction[] {
    switch (category) {
      case 'esg':
        return this.generateESGPredictions();
      case 'carbon':
        return this.generateCarbonPredictions();
      case 'compliance':
        return this.generateCompliancePredictions();
      case 'financial':
        return this.generateFinancialPredictions();
      default:
        return [];
    }
  }

  private static generateESGPredictions(): ESGPrediction[] {
    return [
      {
        id: 'esg-1',
        category: 'esg',
        currentValue: 76,
        predictedValue: 82,
        predictedDate: this.getDateInFuture(90),
        trendDirection: 'up',
        confidence: 0.85,
        factors: [
          { name: 'Enhanced sustainability reporting', impact: 0.4 },
          { name: 'Renewable energy transition', impact: 0.3 },
          { name: 'Employee engagement programs', impact: 0.2 },
          { name: 'Supply chain optimization', impact: 0.1 }
        ]
      },
      {
        id: 'esg-2',
        category: 'esg',
        currentValue: 76,
        predictedValue: 79,
        predictedDate: this.getDateInFuture(180),
        trendDirection: 'up',
        confidence: 0.72,
        factors: [
          { name: 'Governance policy updates', impact: 0.3 },
          { name: 'Community investment', impact: 0.25 },
          { name: 'Diversity initiatives', impact: 0.25 },
          { name: 'Waste reduction', impact: 0.2 }
        ]
      }
    ];
  }

  private static generateCarbonPredictions(): ESGPrediction[] {
    return [
      {
        id: 'carbon-1',
        category: 'carbon',
        currentValue: 125,
        predictedValue: 105,
        predictedDate: this.getDateInFuture(90),
        trendDirection: 'down',
        confidence: 0.88,
        factors: [
          { name: 'Energy efficiency improvements', impact: -0.35 },
          { name: 'Remote work policies', impact: -0.25 },
          { name: 'Reduced business travel', impact: -0.2 },
          { name: 'Supplier emissions reductions', impact: -0.2 }
        ]
      }
    ];
  }

  private static generateCompliancePredictions(): ESGPrediction[] {
    return [
      {
        id: 'compliance-1',
        category: 'compliance',
        currentValue: 92,
        predictedValue: 97,
        predictedDate: this.getDateInFuture(90),
        trendDirection: 'up',
        confidence: 0.91,
        factors: [
          { name: 'Updated reporting procedures', impact: 0.4 },
          { name: 'Staff training programs', impact: 0.3 },
          { name: 'Automated compliance tracking', impact: 0.3 }
        ]
      }
    ];
  }

  private static generateFinancialPredictions(): ESGPrediction[] {
    return [
      {
        id: 'financial-1',
        category: 'financial',
        currentValue: 2500000,
        predictedValue: 2800000,
        predictedDate: this.getDateInFuture(365),
        trendDirection: 'up',
        confidence: 0.67,
        factors: [
          { name: 'ESG investment attractiveness', impact: 0.3 },
          { name: 'Energy cost savings', impact: 0.25 },
          { name: 'Tax incentives', impact: 0.25 },
          { name: 'Reduced compliance penalties', impact: 0.2 }
        ]
      },
      {
        id: 'financial-2',
        category: 'financial',
        currentValue: 2500000,
        predictedValue: 2650000,
        predictedDate: this.getDateInFuture(180),
        trendDirection: 'up',
        confidence: 0.78,
        factors: [
          { name: 'Operational efficiency', impact: 0.4 },
          { name: 'Green product premium', impact: 0.3 },
          { name: 'Waste reduction savings', impact: 0.3 }
        ]
      }
    ];
  }

  private static getDateInFuture(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }
}
