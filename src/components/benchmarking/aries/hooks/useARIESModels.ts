
import { useState, useCallback } from 'react';
import { ARIESModel, ARIESModelResult } from '../types';
import { toast } from 'sonner';

// Mock models for demonstration
const mockModels: ARIESModel[] = [
  {
    id: 'carbon-sequestration',
    name: 'Carbon Sequestration Model',
    description: 'Estimates carbon storage and sequestration in different ecosystems.',
    category: 'carbon',
    complexity: 'moderate',
    dataRequirements: 'Medium',
    processingTime: '1-2 minutes'
  },
  {
    id: 'water-yield',
    name: 'Water Yield Assessment',
    description: 'Calculates water yield and identifies critical source areas.',
    category: 'water',
    complexity: 'moderate',
    dataRequirements: 'Medium',
    processingTime: '2-5 minutes'
  },
  {
    id: 'biodiversity-assessment',
    name: 'Biodiversity Impact Assessment',
    description: 'Evaluates potential impacts on biodiversity from development or policy changes.',
    category: 'biodiversity',
    complexity: 'advanced',
    dataRequirements: 'High',
    processingTime: '5-10 minutes'
  },
  {
    id: 'flood-regulation',
    name: 'Flood Regulation Services',
    description: 'Models how landscapes mitigate flood risks through natural processes.',
    category: 'water',
    complexity: 'advanced',
    dataRequirements: 'High',
    processingTime: '5-8 minutes'
  },
  {
    id: 'carbon-footprint',
    name: 'Carbon Footprint Analysis',
    description: 'Analyzes carbon emissions and offsets across operations.',
    category: 'carbon',
    complexity: 'simple',
    dataRequirements: 'Low',
    processingTime: '<1 minute'
  },
  {
    id: 'ecosystem-service-assessment',
    name: 'Comprehensive Ecosystem Services',
    description: 'Full assessment of multiple ecosystem services in an integrated model.',
    category: 'comprehensive',
    complexity: 'advanced',
    dataRequirements: 'Very High',
    processingTime: '10-15 minutes'
  }
];

// Mock results for the carbon footprint model
const carbonFootprintResults: ARIESModelResult = {
  id: 'result-1',
  modelId: 'carbon-footprint',
  modelName: 'Carbon Footprint Analysis',
  summary: 'Based on the input parameters, this analysis has calculated your organization\'s carbon footprint and identified key areas for potential reduction.',
  keyFindings: [
    'Total carbon footprint estimated at 2,450 metric tons CO2e annually',
    'Energy use accounts for 45% of total emissions',
    'Transportation contributes 30% of emissions',
    'Supply chain represents 25% of total carbon footprint',
    'Potential for 20% reduction through identified efficiency measures'
  ],
  recommendations: [
    'Implement energy efficiency measures in facilities to reduce the largest emission source',
    'Transition company vehicle fleet to electric or hybrid vehicles',
    'Work with top 5 suppliers on carbon reduction initiatives',
    'Consider renewable energy options to offset 40% of current emissions',
    'Develop a carbon offset strategy for emissions that cannot be eliminated'
  ],
  dataPoints: [
    { category: 'Energy', value: 1102.5 },
    { category: 'Transportation', value: 735.0 },
    { category: 'Supply Chain', value: 612.5 }
  ],
  dataVisualization: true,
  processedAt: new Date().toISOString(),
  processingTimeSeconds: 45
};

export function useARIESModels() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ARIESModelResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const runModel = useCallback(async (modelId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call the ARIES API
      console.log(`Running ARIES model: ${modelId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demonstration, return mock results for any model
      // In a real app, the results would be specific to the model and parameters
      const modelResults = {
        ...carbonFootprintResults,
        modelId,
        modelName: mockModels.find(m => m.id === modelId)?.name || 'Model Run',
        processedAt: new Date().toISOString()
      };
      
      setResults(modelResults);
      toast.success('Model run completed successfully');
    } catch (err) {
      console.error('Error running ARIES model:', err);
      setError(err as Error);
      toast.error('Failed to run model');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    models: mockModels,
    isLoading,
    error,
    results,
    runModel
  };
}
