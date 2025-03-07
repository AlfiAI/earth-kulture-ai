
import { toast } from "sonner";
import { esgDataService } from '@/services/esgDataService';
import { MessageProps } from '@/components/ai/Message';

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
  ],
  knowledge: {
    scope1: 'Direct emissions from owned or controlled sources',
    scope2: 'Indirect emissions from the generation of purchased energy',
    scope3: 'All other indirect emissions that occur in a company\'s value chain',
    esg: 'Environmental, Social, and Governance criteria used to evaluate company performance',
    ghgProtocol: 'Global standardized frameworks for measuring and managing greenhouse gas emissions',
    carbonIntensity: 'The amount of carbon emitted per unit of activity, production, or revenue',
  }
};

export class WalyAIService {
  // Enhanced AI processing function
  async processQuery(query: string): Promise<string> {
    // Simple keyword matching to simulate AI understanding
    const lowerQuery = query.toLowerCase();
    
    // Carbon footprint related queries
    if (lowerQuery.includes('carbon') || lowerQuery.includes('emission') || lowerQuery.includes('footprint')) {
      try {
        const emissions = await esgDataService.getCarbonEmissions();
        const footprint = esgDataService.calculateCarbonFootprint(emissions);
        
        return `Based on your current data, your carbon footprint is ${footprint.total} tCO2e, with:
- Scope 1 (direct emissions): ${footprint.scope1} tCO2e
- Scope 2 (indirect emissions): ${footprint.scope2} tCO2e
- Scope 3 (value chain): ${footprint.scope3} tCO2e

Your emissions have decreased by 5.2% compared to last month, which is positive progress. Would you like specific reduction recommendations for any of these scope categories?`;
      } catch (error) {
        console.error('Error fetching carbon data:', error);
        return "I'm having trouble retrieving your carbon data at the moment. Please try again later.";
      }
    }
    
    // ESG score related queries
    if (lowerQuery.includes('esg score') || lowerQuery.includes('sustainability score') || lowerQuery.includes('esg rating')) {
      try {
        const esgData = await esgDataService.getAllESGData();
        const emissions = await esgDataService.getCarbonEmissions();
        const frameworks = await esgDataService.getComplianceFrameworks();
        const score = await esgDataService.calculateESGScore(esgData, emissions, frameworks);
        
        return `Your current ESG score is ${score.overall}/100, which is ${score.comparisonToIndustry} for your industry. Here's the breakdown:
- Environmental: ${score.environmental}/100
- Social: ${score.social}/100
- Governance: ${score.governance}/100

Your score shows a ${score.trend} trend. The environmental component has seen the most improvement, particularly in energy efficiency and waste management. Would you like detailed recommendations to improve your score further?`;
      } catch (error) {
        console.error('Error calculating ESG score:', error);
        return "I'm having trouble calculating your ESG score at the moment. Please try again later.";
      }
    }
    
    // Compliance related queries
    if (lowerQuery.includes('compliance') || lowerQuery.includes('regulation') || lowerQuery.includes('framework')) {
      try {
        const frameworks = await esgDataService.getComplianceFrameworks();
        const compliantCount = frameworks.reduce((count, framework) => {
          const compliantReqs = framework.requirements.filter(req => req.status === 'compliant').length;
          const totalReqs = framework.requirements.length;
          return compliantReqs === totalReqs ? count + 1 : count;
        }, 0);
        
        const atRiskFrameworks = frameworks.filter(framework => 
          framework.requirements.some(req => req.status === 'attention-needed')
        );
        
        return `You're currently tracking ${frameworks.length} compliance frameworks, with ${compliantCount} fully compliant. 
        
${atRiskFrameworks.length > 0 ? `There are ${atRiskFrameworks.length} frameworks requiring attention, including ${atRiskFrameworks.map(f => f.name).join(', ')}.` : 'All frameworks are in good standing.'}

Your overall compliance score is 75%. The most urgent deadline is for TCFD Reporting on September 30, 2023. Would you like specific recommendations on how to address compliance gaps?`;
      } catch (error) {
        console.error('Error fetching compliance data:', error);
        return "I'm having trouble retrieving your compliance data at the moment. Please try again later.";
      }
    }
    
    // Reporting related queries
    if (lowerQuery.includes('report') || lowerQuery.includes('reporting') || lowerQuery.includes('generate report')) {
      return `I can help generate various sustainability reports based on your ESG data. Available report types include:
- ESG Performance Summary
- Carbon Footprint Analysis
- Compliance Status Report
- Sustainability Benchmarking
- Improvement Recommendations

Would you like me to generate a specific report, or would you prefer a comprehensive sustainability report covering all areas?`;
    }
    
    // General queries about capabilities
    if (lowerQuery.includes('help') || lowerQuery.includes('what can you do') || lowerQuery.includes('capabilities')) {
      return `I'm your ESG & Carbon Intelligence Assistant. Here's how I can help:

- Calculate and analyze your carbon footprint across Scopes 1, 2, and 3
- Track compliance with frameworks like GHG Protocol, TCFD, GRI, and more
- Generate sustainability reports tailored to your needs
- Provide ESG performance insights and improvement recommendations
- Detect risks in your sustainability data and compliance status
- Answer questions about sustainability terms and best practices

What specific area would you like assistance with today?`;
    }
    
    // Default response for other queries
    return `Thank you for your question about "${query}". Based on your ESG and carbon data, I can provide insights related to this topic. Would you like me to analyze your current performance in this area, suggest improvements, or explain relevant sustainability concepts?`;
  }

  // Create a message object
  createUserMessage(content: string): MessageProps {
    return {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
  }

  createAIMessage(content: string): MessageProps {
    return {
      id: Date.now().toString(),
      content,
      sender: 'ai',
      timestamp: new Date(),
    };
  }

  // Get default welcome message
  getWelcomeMessage(): MessageProps {
    return {
      id: '1',
      content: "Hello! I'm Waly, your ESG & Carbon Intelligence Assistant. I can help with sustainability reporting, carbon footprint analysis, ESG compliance, and more. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    };
  }
}

export const walyAIService = new WalyAIService();
