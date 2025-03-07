
import { ESGDataPoint, CarbonEmission, ComplianceFramework } from '../types/esgTypes';

// Sample ESG data
export const sampleESGData: ESGDataPoint[] = [
  {
    id: '1',
    category: 'environmental',
    subCategory: 'energy',
    value: 120000,
    unit: 'kWh',
    source: 'utility bills',
    date: '2023-08-15',
    verified: true,
  },
  {
    id: '2',
    category: 'environmental',
    subCategory: 'water',
    value: 8500,
    unit: 'm3',
    source: 'water bills',
    date: '2023-08-15',
    verified: true,
  },
  // More data points would be here in a real implementation
];

// Sample carbon emissions data
export const sampleCarbonEmissions: CarbonEmission[] = [
  {
    id: '1',
    scope: 'scope1',
    category: 'stationary combustion',
    source: 'natural gas',
    amount: 210,
    unit: 'tCO2e',
    date: '2023-08',
  },
  {
    id: '2',
    scope: 'scope2',
    category: 'purchased electricity',
    source: 'grid electricity',
    amount: 142,
    unit: 'tCO2e',
    date: '2023-08',
  },
  {
    id: '3',
    scope: 'scope3',
    category: 'purchased goods and services',
    source: 'supply chain',
    amount: 620,
    unit: 'tCO2e',
    date: '2023-08',
  },
  {
    id: '4',
    scope: 'scope3',
    category: 'business travel',
    source: 'flights',
    amount: 180,
    unit: 'tCO2e',
    date: '2023-08',
  },
  {
    id: '5',
    scope: 'scope3',
    category: 'employee commuting',
    source: 'commuting',
    amount: 120,
    unit: 'tCO2e',
    date: '2023-08',
  },
];

// Sample compliance frameworks
export const complianceFrameworks: ComplianceFramework[] = [
  {
    id: '1',
    name: 'GHG Protocol',
    description: 'The Greenhouse Gas Protocol provides standards, guidance, tools, and training for business and government to measure and manage climate-warming emissions.',
    requirements: [
      {
        id: '1-1',
        name: 'Scope 1 emissions reporting',
        description: 'Direct GHG emissions from sources owned or controlled by the company',
        status: 'compliant',
        score: 92,
        lastUpdated: '2023-08-15',
      },
      {
        id: '1-2',
        name: 'Scope 2 emissions reporting',
        description: 'Indirect GHG emissions from purchased electricity, steam, heating and cooling',
        status: 'compliant',
        score: 95,
        lastUpdated: '2023-08-15',
      },
      {
        id: '1-3',
        name: 'Scope 3 emissions reporting',
        description: 'All other indirect emissions in a company\'s value chain',
        status: 'in-progress',
        score: 78,
        lastUpdated: '2023-08-10',
      },
    ],
    lastUpdated: '2023-08-15',
  },
  {
    id: '2',
    name: 'TCFD Reporting',
    description: 'The Task Force on Climate-related Financial Disclosures provides a framework for companies to disclose climate-related financial information.',
    requirements: [
      {
        id: '2-1',
        name: 'Governance',
        description: 'Disclosure of the organization\'s governance around climate-related risks and opportunities',
        status: 'compliant',
        score: 85,
        lastUpdated: '2023-08-12',
      },
      {
        id: '2-2',
        name: 'Strategy',
        description: 'Disclosure of the actual and potential impacts of climate-related risks and opportunities on the organization\'s businesses, strategy, and financial planning',
        status: 'in-progress',
        score: 62,
        lastUpdated: '2023-08-10',
      },
      {
        id: '2-3',
        name: 'Risk Management',
        description: 'Disclosure of how the organization identifies, assesses, and manages climate-related risks',
        status: 'in-progress',
        score: 58,
        lastUpdated: '2023-08-05',
      },
      {
        id: '2-4',
        name: 'Metrics and Targets',
        description: 'Disclosure of the metrics and targets used to assess and manage relevant climate-related risks and opportunities',
        status: 'attention-needed',
        score: 45,
        lastUpdated: '2023-07-28',
      },
    ],
    lastUpdated: '2023-08-12',
    deadline: '2023-09-30',
  },
  // More frameworks would be included in a real implementation
];
