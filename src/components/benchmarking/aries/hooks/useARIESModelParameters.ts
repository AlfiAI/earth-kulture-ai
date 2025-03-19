import { useState, useEffect } from 'react';
import { ARIESModelParameter } from '../types';

// Mock parameters for the carbon footprint model
const carbonFootprintParameters: ARIESModelParameter[] = [
  {
    id: 'region',
    name: 'Geographic Region',
    description: 'Select the region where your operations are primarily located',
    type: 'select',
    required: true,
    options: [
      { label: 'North America', value: 'north_america' },
      { label: 'Europe', value: 'europe' },
      { label: 'Asia Pacific', value: 'asia_pacific' },
      { label: 'Latin America', value: 'latin_america' },
      { label: 'Africa & Middle East', value: 'africa_middle_east' }
    ]
  },
  {
    id: 'industry',
    name: 'Industry Sector',
    description: 'Select your primary industry sector',
    type: 'select',
    required: true,
    options: [
      { label: 'Manufacturing', value: 'manufacturing' },
      { label: 'Technology', value: 'technology' },
      { label: 'Retail', value: 'retail' },
      { label: 'Healthcare', value: 'healthcare' },
      { label: 'Finance', value: 'finance' },
      { label: 'Energy', value: 'energy' },
      { label: 'Agriculture', value: 'agriculture' }
    ]
  },
  {
    id: 'energy_consumption',
    name: 'Annual Energy Consumption',
    description: 'Total annual energy consumption across all facilities',
    type: 'number',
    required: true,
    placeholder: 'Enter value in kWh',
    min: 0
  },
  {
    id: 'renewable_percentage',
    name: 'Renewable Energy Percentage',
    description: 'Percentage of energy from renewable sources',
    type: 'slider',
    required: false,
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0,
    unit: '%'
  },
  {
    id: 'vehicle_fleet_size',
    name: 'Vehicle Fleet Size',
    description: 'Number of vehicles in company fleet',
    type: 'number',
    required: false,
    placeholder: 'Enter number of vehicles',
    min: 0
  },
  {
    id: 'include_scope3',
    name: 'Include Scope 3 Emissions',
    description: 'Include emissions from your supply chain',
    type: 'boolean',
    required: false
  }
];

// Mock parameters for water yield assessment
const waterYieldParameters: ARIESModelParameter[] = [
  {
    id: 'watershed',
    name: 'Watershed Boundary',
    description: 'Specify the watershed area for analysis',
    type: 'text',
    required: true,
    placeholder: 'Enter watershed name or ID'
  },
  {
    id: 'precipitation_data',
    name: 'Precipitation Data Source',
    description: 'Select source of precipitation data',
    type: 'select',
    required: true,
    options: [
      { label: 'Global Climate Data', value: 'global_climate' },
      { label: 'Local Weather Stations', value: 'local_weather' },
      { label: 'Custom Uploaded Data', value: 'custom' }
    ]
  },
  {
    id: 'land_cover',
    name: 'Land Cover Resolution',
    description: 'Resolution of land cover data for analysis',
    type: 'select',
    required: true,
    options: [
      { label: 'High (10m)', value: 'high' },
      { label: 'Medium (30m)', value: 'medium' },
      { label: 'Low (250m)', value: 'low' }
    ]
  },
  {
    id: 'time_period',
    name: 'Analysis Time Period',
    description: 'Time period for water yield analysis',
    type: 'select',
    required: true,
    options: [
      { label: 'Annual Average', value: 'annual' },
      { label: 'Seasonal (4 seasons)', value: 'seasonal' },
      { label: 'Monthly', value: 'monthly' }
    ]
  }
];

// Map model IDs to their parameters
const modelParametersMap: Record<string, ARIESModelParameter[]> = {
  'carbon-footprint': carbonFootprintParameters,
  'water-yield': waterYieldParameters,
  // Other models would have their parameters defined here
};

export function useARIESModelParameters(modelId: string) {
  const [parameters, setParameters] = useState<ARIESModelParameter[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call to fetch parameters
    setTimeout(() => {
      setParameters(modelParametersMap[modelId] || []);
      setIsLoading(false);
    }, 500);
  }, [modelId]);

  return {
    parameters,
    isLoading
  };
}
