
import { useState, useEffect } from 'react';
import { MessageProps } from '../Message';

export interface CarbonInsight {
  id: string;
  title: string;
  description: string;
  reductionOpportunity?: number; // percentage reduction possible
  confidence: number; // 0-1 confidence score
  source: 'ai' | 'data' | 'benchmark';
}

interface CarbonInsightProviderProps {
  messages: MessageProps[];
  currentPageContext?: string;
}

/**
 * Analyzes conversations to provide carbon-related insights and reduction opportunities
 */
const CarbonInsightProvider = ({ messages, currentPageContext }: CarbonInsightProviderProps) => {
  const [insights, setInsights] = useState<CarbonInsight[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Process recent messages to generate insights
  useEffect(() => {
    if (messages.length > 2 && !isProcessing) {
      generateCarbonInsights();
    }
  }, [messages]);

  const generateCarbonInsights = async () => {
    setIsProcessing(true);
    
    try {
      // Get the last few messages for context
      const recentMessages = messages.slice(-3);
      const combinedText = recentMessages
        .map(msg => msg.content)
        .join(' ')
        .toLowerCase();
      
      // Simple keyword-based insight generation
      // In a real implementation, this would use the AI service
      if (combinedText.includes('carbon') || 
          combinedText.includes('emission') || 
          combinedText.includes('footprint')) {
        
        const newInsight: CarbonInsight = {
          id: `insight-${Date.now()}`,
          title: 'Carbon Footprint Analysis',
          description: 'Based on your conversation, you might benefit from a detailed Scope 1, 2, and 3 emissions analysis.',
          reductionOpportunity: 15,
          confidence: 0.75,
          source: 'ai'
        };
        
        setInsights(prev => [...prev, newInsight]);
      }
    } catch (error) {
      console.error('Error generating carbon insights:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    insights,
    isProcessing
  };
};

export default CarbonInsightProvider;
