
import { useState, useRef, useEffect } from 'react';
import { Bot, Stars, ArrowRight, RefreshCcw, Brain, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { MessageProps } from './Message';
import { benchmarkingService } from '@/services/benchmarkingService';
import { esgDataService } from '@/services/esgDataService';
import { toast } from "sonner";

interface EnhancedWalyAssistantProps {
  initialOpen?: boolean;
}

// Enhanced AI context data
const enhancedAIContext = {
  capabilities: [
    'ESG benchmarking & industry comparisons',
    'Predictive modeling for sustainability performance',
    'ESG risk identification & mitigation strategies',
    'Personalized sustainability action plans',
    'Advanced regulatory compliance forecasting',
    'Financial impact analysis of ESG initiatives',
    'Dynamic goal setting & tracking',
    'Industry-wide ESG trend analysis',
  ],
  assistantMode: 'proactive', // can be 'proactive' or 'reactive'
  learningRate: 0.85, // simulated AI learning rate (0-1)
  confidenceThreshold: 0.75, // threshold for making proactive recommendations
};

const EnhancedWalyAssistant = ({ initialOpen = false }: EnhancedWalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      id: '1',
      content: "Hello! I'm Waly, your enhanced ESG & Carbon Intelligence Assistant. I now offer advanced benchmarking, predictive analytics, and industry comparisons. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Simulate proactive AI behavior
  useEffect(() => {
    if (enhancedAIContext.assistantMode === 'proactive' && isOpen) {
      const proactiveInterval = setTimeout(() => {
        if (messages.length === 1) {
          const proactiveMessage: MessageProps = {
            id: Date.now().toString(),
            content: "I've noticed you're in the top quartile for environmental performance, but I've identified opportunities to improve your social score based on industry benchmarks. Would you like to see my recommendations?",
            sender: 'ai',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, proactiveMessage]);
        }
      }, 15000); // Show proactive message after 15 seconds
      
      return () => clearTimeout(proactiveInterval);
    }
  }, [isOpen, messages.length]);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Enhanced AI processing function with benchmarking capabilities
  const processQuery = async (query: string): Promise<string> => {
    // Simple keyword matching to simulate enhanced AI understanding
    const lowerQuery = query.toLowerCase();
    
    // Benchmarking related queries
    if (lowerQuery.includes('benchmark') || lowerQuery.includes('comparison') || lowerQuery.includes('industry') || lowerQuery.includes('peers')) {
      try {
        const esgScore = await esgDataService.calculateESGScore(
          await esgDataService.getAllESGData(),
          await esgDataService.getCarbonEmissions(),
          await esgDataService.getComplianceFrameworks()
        );
        
        const comparison = await benchmarkingService.compareToIndustry(esgScore);
        
        return `Based on my analysis, your ESG performance ranks in the ${comparison.overallPercentile}th percentile among industry peers.

Key insights:
• Environmental: ${comparison.environmentalPercentile}th percentile (${comparison.environmentalPercentile > 75 ? 'Industry leader' : comparison.environmentalPercentile > 50 ? 'Above average' : 'Below average'})
• Social: ${comparison.socialPercentile}th percentile (${comparison.socialPercentile > 75 ? 'Industry leader' : comparison.socialPercentile > 50 ? 'Above average' : 'Below average'})
• Governance: ${comparison.governancePercentile}th percentile (${comparison.governancePercentile > 75 ? 'Industry leader' : comparison.governancePercentile > 50 ? 'Above average' : 'Below average'})

Your environmental initiatives are particularly strong compared to peers, but I've identified opportunities to improve your social score through enhanced employee development programs and community engagement initiatives.

Would you like me to generate a detailed benchmark report or provide specific recommendations for improvement?`;
      } catch (error) {
        console.error('Error processing benchmarking query:', error);
        return "I'm having trouble retrieving benchmarking data at the moment. Please try again later.";
      }
    }
    
    // Predictive analytics related queries
    if (lowerQuery.includes('predict') || lowerQuery.includes('forecast') || lowerQuery.includes('future') || lowerQuery.includes('trend')) {
      try {
        const predictions = await benchmarkingService.getPredictions();
        const esgPrediction = predictions.find(p => p.category === 'esg');
        const carbonPrediction = predictions.find(p => p.category === 'carbon');
        
        return `Based on my predictive models analyzing your historical data and industry trends, I forecast:

• ESG Score: ${esgPrediction?.currentValue}/100 → ${esgPrediction?.predictedValue}/100 by ${new Date(esgPrediction?.predictedDate || '').toLocaleDateString()} (${esgPrediction?.confidence ? Math.round(esgPrediction.confidence * 100) : 0}% confidence)
• Carbon Emissions: ${carbonPrediction?.currentValue} tCO2e → ${carbonPrediction?.predictedValue} tCO2e by ${new Date(carbonPrediction?.predictedDate || '').toLocaleDateString()} (${carbonPrediction?.confidence ? Math.round(carbonPrediction.confidence * 100) : 0}% confidence)

Key factors influencing these predictions:
${esgPrediction?.factors.map(f => `• ${f.name}: ${f.impact > 0 ? 'Positive' : 'Negative'} impact (${Math.abs(Math.round(f.impact * 100))}%)`).join('\n')}

Would you like me to provide a detailed analysis of any specific area or generate recommendations to improve these projections?`;
      } catch (error) {
        console.error('Error processing prediction query:', error);
        return "I'm having trouble generating predictions at the moment. Please try again later.";
      }
    }
    
    // Goals and action plans related queries
    if (lowerQuery.includes('goal') || lowerQuery.includes('target') || lowerQuery.includes('action plan') || lowerQuery.includes('strategy')) {
      try {
        const goals = await benchmarkingService.getSustainabilityGoals();
        
        return `I see you currently have ${goals.length} active sustainability goals:

${goals.map(g => `• ${g.name}: ${g.currentValue} ${g.unit} → ${g.targetValue} ${g.unit} (${g.progress}% complete, ${g.status.replace('-', ' ')})`).join('\n')}

Based on industry benchmarks and your current performance, I recommend considering these additional goals:

• Reduce Scope 3 emissions by 15% within 18 months
• Increase renewable energy sourcing to 75% by 2025
• Implement a sustainable supplier program covering 90% of key suppliers

Would you like me to generate a detailed AI-powered action plan for any of these goals, or create a custom goal aligned with your sustainability strategy?`;
      } catch (error) {
        console.error('Error processing goals query:', error);
        return "I'm having trouble accessing your sustainability goals at the moment. Please try again later.";
      }
    }
    
    // Regulatory and compliance related queries
    if (lowerQuery.includes('regulation') || lowerQuery.includes('compliance') || lowerQuery.includes('law') || lowerQuery.includes('requirement')) {
      return `Based on my analysis of your operations and the regulatory landscape, here are key compliance insights:

• EU Corporate Sustainability Reporting Directive (CSRD): Your operations will require enhanced reporting by Q3 2024
• Science-Based Targets Initiative (SBTi): Your current targets need updating to align with latest 1.5°C pathway requirements
• Sustainable Finance Disclosure Regulation (SFDR): New disclosure requirements will impact your investor relations

I'm tracking 17 regulatory changes that could affect your operations in the next 12 months. The most significant include the EU Carbon Border Adjustment Mechanism and updates to the GHG Protocol.

Would you like me to prepare a detailed compliance risk assessment or create an action plan to address the most urgent requirements?`;
    }
    
    // Default response with enhanced capabilities
    return `Thank you for your question about "${query}". As your enhanced ESG & Carbon Intelligence Assistant, I can now provide:

• Industry benchmarking and peer comparisons
• Predictive modeling for sustainability performance
• AI-generated action plans for your sustainability goals
• Regulatory compliance forecasting
• Financial impact analysis of ESG initiatives

Would you like me to analyze a specific aspect of your sustainability performance, generate predictive insights, or provide benchmarking data?`;
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
      // Process the user query with enhanced AI
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
          <Stars className="h-6 w-6" />
        </Button>
      )}
      
      <Card
        className={cn(
          "fixed right-4 bottom-4 w-80 sm:w-96 shadow-lg border overflow-hidden transition-all duration-300 ease-in-out z-50",
          isOpen ? "h-[550px] max-h-[80vh] opacity-100" : "h-0 opacity-0 pointer-events-none"
        )}
      >
        <ChatHeader onClose={toggleOpen} title="Enhanced Waly Assistant" />
        
        <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
          <div className="bg-primary/5 border-b px-4 py-2 flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">AI-powered benchmarking & predictive analytics enabled</span>
          </div>
          
          <MessageList 
            messages={messages} 
            isTyping={isTyping} 
          />
          
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSend={handleSend}
            inputRef={inputRef}
            placeholder="Ask about benchmarking, predictions, goals..."
          />
        </CardContent>
      </Card>
    </>
  );
};

export default EnhancedWalyAssistant;
