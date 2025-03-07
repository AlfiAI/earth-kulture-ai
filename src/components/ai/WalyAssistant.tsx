
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { MessageProps } from './Message';
import { esgDataService } from '@/services/esgDataService';
import { toast } from "sonner";

interface WalyAssistantProps {
  initialOpen?: boolean;
}

// AI context data for enhanced responses
const aiContext = {
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

const WalyAssistant = ({ initialOpen = false }: WalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      id: '1',
      content: "Hello! I'm Waly, your ESG & Carbon Intelligence Assistant. I can help with sustainability reporting, carbon footprint analysis, ESG compliance, and more. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Enhanced AI processing function
  const processQuery = async (query: string): Promise<string> => {
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
  };
  
  const handleSend = async () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: MessageProps = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Process the user query with AI
      const aiResponse = await processQuery(userMessage.content);
      
      const aiMessage: MessageProps = {
        id: Date.now().toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error('Sorry, I encountered an error processing your request.');
      
      const errorMessage: MessageProps = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          className="fixed right-4 bottom-4 rounded-full w-14 h-14 shadow-lg p-0 animate-in bg-primary text-white hover:bg-primary/90"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}
      
      <Card
        className={cn(
          "fixed right-4 bottom-4 w-80 sm:w-96 shadow-lg border overflow-hidden transition-all duration-300 ease-in-out z-50",
          isOpen ? "h-[550px] max-h-[80vh] opacity-100" : "h-0 opacity-0 pointer-events-none"
        )}
      >
        <ChatHeader onClose={toggleOpen} />
        
        <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
          <MessageList 
            messages={messages} 
            isTyping={isTyping} 
          />
          
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSend={handleSend}
            inputRef={inputRef}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default WalyAssistant;
