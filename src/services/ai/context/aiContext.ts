
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
  }
};
