import { IndustryType } from '../orchestration/types/agentTypes';

// Industry-specific contexts for tailored AI responses
const industryContexts: Record<string, {
  relevantFrameworks: string[];
  keyMetrics: string[];
  regulatoryFocus: string[];
  benchmarkComparisons: string[];
}> = {
  [IndustryType.CORPORATE]: {
    relevantFrameworks: ['GRI Standards', 'SASB', 'TCFD', 'CDP Climate Change'],
    keyMetrics: ['Carbon footprint', 'Energy efficiency', 'Waste management', 'Water usage'],
    regulatoryFocus: ['Corporate reporting requirements', 'Emissions caps', 'Board diversity'],
    benchmarkComparisons: ['Industry leaders', 'Sector averages', 'Competitors']
  },
  [IndustryType.SME]: {
    relevantFrameworks: ['SME Climate Hub', 'B Corp', 'ISO 14001'],
    keyMetrics: ['Carbon footprint', 'Energy usage', 'Waste reduction', 'Local impact'],
    regulatoryFocus: ['Local regulations', 'Supply chain requirements', 'Green certification'],
    benchmarkComparisons: ['Similar sized businesses', 'Local competitors', 'Industry best practices']
  },
  [IndustryType.GOVERNMENT]: {
    relevantFrameworks: ['GHG Protocol for Cities', 'ICLEI', 'UN SDGs'],
    keyMetrics: ['Public services emissions', 'Policy effectiveness', 'Community impact'],
    regulatoryFocus: ['National targets', 'International agreements', 'Public transparency'],
    benchmarkComparisons: ['Other government entities', 'International standards', 'Historical trends']
  },
  [IndustryType.INDIVIDUAL]: {
    relevantFrameworks: ['Personal Carbon Footprint', 'Sustainable Lifestyle'],
    keyMetrics: ['Home energy usage', 'Transportation emissions', 'Consumption patterns'],
    regulatoryFocus: ['Local incentives', 'Rebate programs', 'Community initiatives'],
    benchmarkComparisons: ['National averages', 'Similar demographics', 'Personal goals']
  },
  [IndustryType.EDUCATION]: {
    relevantFrameworks: ['STARS', 'Green Ribbon Schools'],
    keyMetrics: ['Campus emissions', 'Curriculum integration', 'Student engagement'],
    regulatoryFocus: ['Education sector guidelines', 'Campus policies', 'Student initiatives'],
    benchmarkComparisons: ['Similar institutions', 'Education sector leaders']
  },
  [IndustryType.HEALTHCARE]: {
    relevantFrameworks: ['Healthcare Without Harm', 'Green Hospital Certification'],
    keyMetrics: ['Medical waste management', 'Energy efficiency', 'Supply chain sustainability'],
    regulatoryFocus: ['Healthcare regulations', 'Patient safety', 'Medical waste disposal'],
    benchmarkComparisons: ['Healthcare industry averages', 'Similar facilities']
  },
  [IndustryType.ENERGY]: {
    relevantFrameworks: ['TCFD', 'SASB Energy Standards', 'IEA Guidelines'],
    keyMetrics: ['Emissions intensity', 'Renewable mix', 'Transition planning'],
    regulatoryFocus: ['Energy transition policies', 'Carbon taxes', 'Renewables mandates'],
    benchmarkComparisons: ['Industry peers', 'Transition leaders', 'Regional averages']
  },
  [IndustryType.MANUFACTURING]: {
    relevantFrameworks: ['ISO 14001', 'Cradle to Cradle', 'SASB Manufacturing'],
    keyMetrics: ['Production emissions', 'Material efficiency', 'Circular economy metrics'],
    regulatoryFocus: ['Industrial emissions standards', 'Chemical regulations', 'Extended producer responsibility'],
    benchmarkComparisons: ['Industry averages', 'Sector leaders', 'Similar facilities']
  },
  [IndustryType.FINANCIAL]: {
    relevantFrameworks: ['PCAF', 'UNEP FI', 'Equator Principles'],
    keyMetrics: ['Financed emissions', 'ESG portfolio scoring', 'Green investment percentage'],
    regulatoryFocus: ['Sustainable finance disclosure', 'Climate risk reporting', 'ESG integration'],
    benchmarkComparisons: ['Financial sector averages', 'Leading institutions', 'Portfolio benchmarks']
  },
  [IndustryType.RETAIL]: {
    relevantFrameworks: ['Sustainable Apparel Coalition', 'SASB Retail'],
    keyMetrics: ['Supply chain emissions', 'Packaging waste', 'Product sustainability'],
    regulatoryFocus: ['Extended producer responsibility', 'Packaging regulations', 'Labor practices'],
    benchmarkComparisons: ['Retail sector averages', 'Leading retailers', 'Consumer expectations']
  },
  [IndustryType.TECHNOLOGY]: {
    relevantFrameworks: ['GHG Protocol', 'SASB Technology', 'EPEAT'],
    keyMetrics: ['Data center emissions', 'E-waste', 'Renewable energy usage'],
    regulatoryFocus: ['Digital accessibility', 'E-waste regulations', 'Data privacy'],
    benchmarkComparisons: ['Tech sector leaders', 'Similar companies', 'Industry standards']
  },
  [IndustryType.OTHER]: {
    relevantFrameworks: ['GHG Protocol', 'UN SDGs', 'ISO 14001'],
    keyMetrics: ['Carbon footprint', 'Energy efficiency', 'Resource usage'],
    regulatoryFocus: ['General compliance', 'Sector-specific regulations'],
    benchmarkComparisons: ['General industry averages', 'Sustainability leaders']
  }
};

// AI context data for enhanced responses
export const aiContext = {
  frameworks: [
    'GHG Protocol',
    'TCFD',
    'GRI Standards',
    'SASB',
    'EU Taxonomy',
    'CDP Climate Change',
  ],
  capabilities: [
    'ESG data analysis',
    'Carbon footprint calculation',
    'Compliance tracking',
    'Sustainability reporting',
    'Risk assessment',
    'Benchmarking',
    'Trend detection',
    'Predictive analytics',
    'Industry comparison',
    'Goal setting automation',
  ],
  knowledge: {
    scope1: 'Direct emissions from owned or controlled sources',
    scope2: 'Indirect emissions from the generation of purchased energy',
    scope3: 'All other indirect emissions that occur in a company\'s value chain',
    esg: 'Environmental, Social, and Governance criteria used to evaluate company performance',
    ghgProtocol: 'Global standardized frameworks for measuring and managing greenhouse gas emissions',
    carbonIntensity: 'The amount of carbon emitted per unit of activity, production, or revenue',
    scienceBasedTargets: 'Emissions reduction targets in line with what latest climate science says is necessary to meet Paris Agreement goals',
    circularEconomy: 'An economic system aimed at eliminating waste and the continual use of resources',
  },
  conversationMemory: {
    recentTopics: [] as string[],
    userPreferences: {} as Record<string, any>,
    activeContexts: [] as string[]
  },
  industryContexts,
  
  // Function to get industry-specific context
  getIndustryContext(industry: IndustryType = IndustryType.CORPORATE) {
    return industryContexts[industry] || industryContexts[IndustryType.OTHER];
  }
};
