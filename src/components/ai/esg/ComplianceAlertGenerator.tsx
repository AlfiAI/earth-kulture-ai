
import { useState, useEffect } from 'react';
import { MessageProps } from '../Message';

export interface ComplianceAlert {
  id: string;
  title: string;
  description: string;
  framework: string;
  severity: 'high' | 'medium' | 'low';
  dueDate?: Date;
}

interface ComplianceAlertGeneratorProps {
  messages: MessageProps[];
  userIndustry?: string;
  userRegion?: string;
}

/**
 * Generates compliance alerts based on conversation context and user profile
 */
const ComplianceAlertGenerator = ({ 
  messages, 
  userIndustry = 'general', 
  userRegion = 'global' 
}: ComplianceAlertGeneratorProps) => {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Check for compliance topics in conversation
    if (messages.length > 2) {
      analyzeForComplianceTopics();
    }
  }, [messages]);

  const analyzeForComplianceTopics = async () => {
    setIsAnalyzing(true);
    
    try {
      // Get recent messages
      const recentMessages = messages.slice(-3);
      const combinedText = recentMessages
        .map(msg => msg.content)
        .join(' ')
        .toLowerCase();
      
      // Check for compliance-related keywords
      if (combinedText.includes('compliance') || 
          combinedText.includes('regulation') || 
          combinedText.includes('reporting') ||
          combinedText.includes('framework')) {
        
        // Generate industry and region-specific compliance alerts
        // This is a simplified example - in production this would call an AI service
        
        // CSRD alert for European companies
        if (userRegion.includes('eu') || userRegion.includes('europe')) {
          const csrdAlert: ComplianceAlert = {
            id: `alert-${Date.now()}-csrd`,
            title: 'CSRD Reporting Deadline Approaching',
            description: 'The Corporate Sustainability Reporting Directive requires detailed sustainability disclosures. Your organization needs to prepare for compliance.',
            framework: 'CSRD',
            severity: 'high',
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
          };
          
          setAlerts(prev => [...prev, csrdAlert]);
        }
        
        // SEC alert for US companies
        if (userRegion.includes('us') || userRegion.includes('united states')) {
          const secAlert: ComplianceAlert = {
            id: `alert-${Date.now()}-sec`,
            title: 'SEC Climate Disclosure Rules',
            description: 'New SEC requirements for climate-related financial disclosure. Review your current reporting to identify gaps.',
            framework: 'SEC',
            severity: 'medium'
          };
          
          setAlerts(prev => [...prev, secAlert]);
        }
      }
    } catch (error) {
      console.error('Error analyzing for compliance topics:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    alerts,
    isAnalyzing
  };
};

export default ComplianceAlertGenerator;
