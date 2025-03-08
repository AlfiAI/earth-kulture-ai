
// Enhanced AI context for Waly Pro

// System prompt for advanced ESG & Carbon Intelligence
export const ENHANCED_SYSTEM_PROMPT = `You are Waly Pro, an advanced ESG & Carbon Intelligence Assistant specializing in sustainability reporting, emissions analysis, 
and regulatory compliance. You provide data-driven insights and actionable recommendations to help organizations improve their sustainability practices.

You have expertise in:
- Carbon footprint calculation and optimization (Scope 1, 2, and 3 emissions)
- ESG reporting frameworks (GHG Protocol, TCFD, GRI, SASB, EU Taxonomy, CDP)
- Sustainability strategy development with industry benchmarking
- Regulatory compliance tracking and risk prediction
- AI-powered trend analysis and forecasting
- Goal-setting and performance optimization

Your capabilities include:
- Predictive ESG risk assessments
- Industry-specific benchmarking
- Multi-turn contextual conversations
- Personalized sustainability recommendations
- Compliance risk detection
- Performance trend analysis

Always provide specific, actionable insights based on industry best practices. Include relevant regulations, frameworks, or methodologies when appropriate.
Keep responses structured, focusing on practical advice, clear explanations, and data-backed recommendations.`;

// Enhanced AI context data
export const enhancedAIContext = {
  // Enhanced capabilities for Waly Pro
  capabilities: [
    'Advanced ESG data analysis',
    'Predictive carbon footprint modeling',
    'AI-driven compliance risk detection',
    'Real-time benchmarking against industry peers',
    'Automated sustainability goal-setting',
    'Contextual multi-turn conversations',
    'Personalized sustainability recommendations',
    'ESG trend forecasting',
    'Industry-specific best practices',
    'Predictive regulatory analysis',
  ],
  
  // Comprehensive knowledge base
  knowledge: {
    scope1: 'Direct emissions from owned or controlled sources',
    scope2: 'Indirect emissions from the generation of purchased energy',
    scope3: 'All other indirect emissions that occur in a company\'s value chain',
    esg: 'Environmental, Social, and Governance criteria used to evaluate company performance',
    ghgProtocol: 'Global standardized frameworks for measuring and managing greenhouse gas emissions',
    tcfd: 'Task Force on Climate-related Financial Disclosures framework for climate-related reporting',
    scienceBasedTargets: 'Emissions reduction targets aligned with the Paris Agreement goals',
    euTaxonomy: 'EU classification system for environmentally sustainable economic activities',
    carbonIntensity: 'The amount of carbon emitted per unit of activity, production, or revenue',
    netZero: 'Achieving a balance between emissions produced and emissions removed from the atmosphere',
    circularEconomy: 'An economic system aimed at eliminating waste and the continual use of resources',
    carbonOffset: 'A reduction in emissions of carbon dioxide made to compensate for emissions made elsewhere',
    carbonPrice: 'A cost applied to carbon pollution to encourage polluters to reduce emissions',
    esrs: 'European Sustainability Reporting Standards for corporate sustainability reporting',
    csrd: 'Corporate Sustainability Reporting Directive requiring detailed ESG disclosures',
  },
  
  // Industry benchmarks for comparison
  industryBenchmarks: {
    manufacturing: { carbonIntensity: 0.58, waterUsage: 4.2, wasteRecycling: 67 },
    technology: { carbonIntensity: 0.12, waterUsage: 0.9, wasteRecycling: 82 },
    retail: { carbonIntensity: 0.21, waterUsage: 1.3, wasteRecycling: 71 },
    finance: { carbonIntensity: 0.05, waterUsage: 0.6, wasteRecycling: 75 },
    healthcare: { carbonIntensity: 0.17, waterUsage: 2.1, wasteRecycling: 69 },
    energy: { carbonIntensity: 1.24, waterUsage: 6.8, wasteRecycling: 58 },
  },
  
  // Conversation memory configuration
  assistantMode: 'balanced', // Options: 'proactive', 'reactive', 'balanced'
  
  // Regulatory update awareness
  regulatoryUpdates: [
    { name: 'EU CSRD', effectiveDate: '2024-01-01', region: 'EU', sector: 'All' },
    { name: 'SEC Climate Disclosure', effectiveDate: '2023-12-01', region: 'US', sector: 'Public companies' },
    { name: 'UK Sustainability Disclosure Requirements', effectiveDate: '2024-06-01', region: 'UK', sector: 'Financial services' },
  ],
};
