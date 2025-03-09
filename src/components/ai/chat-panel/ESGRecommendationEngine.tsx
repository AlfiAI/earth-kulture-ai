
import { useEffect, useState } from 'react';
import { MessageProps } from '../Message';

interface ESGRecommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'carbon' | 'social' | 'governance' | 'compliance';
}

interface ESGRecommendationEngineProps {
  messages: MessageProps[];
  currentPath: string;
}

/**
 * Analyzes chat context to provide relevant ESG recommendations
 */
const ESGRecommendationEngine = ({ messages, currentPath }: ESGRecommendationEngineProps) => {
  const [recommendations, setRecommendations] = useState<ESGRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Only analyze after there are multiple messages in the conversation
    if (messages.length > 2) {
      analyzeConversation();
    }
  }, [messages]);

  const analyzeConversation = async () => {
    setIsAnalyzing(true);
    
    try {
      // Extract topics and intents from the conversation
      const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
      const lastAIMessage = messages.filter(m => m.sender === 'ai').pop();
      
      if (!lastUserMessage || !lastAIMessage) {
        setIsAnalyzing(false);
        return;
      }
      
      // In a real implementation, this would call an API to get AI-powered recommendations
      // For now, we'll use simple keyword matching
      const userQuery = lastUserMessage.content.toLowerCase();
      const newRecommendations: ESGRecommendation[] = [];
      
      if (userQuery.includes('carbon') || userQuery.includes('emission')) {
        newRecommendations.push({
          title: 'Carbon Footprint Analysis',
          description: 'Conduct a detailed Scope 1, 2, and 3 emissions analysis to identify reduction opportunities.',
          impact: 'high',
          category: 'carbon'
        });
      }
      
      if (userQuery.includes('compliance') || userQuery.includes('regulation')) {
        newRecommendations.push({
          title: 'Regulatory Compliance Review',
          description: 'Assess your current ESG reporting against evolving regulations like CSRD or SEC climate disclosures.',
          impact: 'high',
          category: 'compliance'
        });
      }
      
      if (userQuery.includes('supplier') || userQuery.includes('supply chain')) {
        newRecommendations.push({
          title: 'Supply Chain Sustainability Assessment',
          description: 'Map your supplier network for ESG risks and engagement opportunities.',
          impact: 'medium',
          category: 'governance'
        });
      }
      
      // Update recommendations if we found any new ones
      if (newRecommendations.length > 0) {
        setRecommendations(prev => [...prev, ...newRecommendations]);
      }
    } catch (error) {
      console.error('Error analyzing conversation for ESG recommendations:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    recommendations,
    isAnalyzing
  };
};

export default ESGRecommendationEngine;
