
import { useState, useRef, useEffect } from 'react';
import { Stars, Brain } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { MessageProps } from './Message';
import { toast } from "sonner";
import { deepseekService } from '@/services/ai/deepseekService';

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

// Enhanced system prompt for DeepSeek API
const ENHANCED_SYSTEM_PROMPT = `You are Waly Pro, an advanced ESG & Carbon Intelligence Assistant with enhanced capabilities.
You specialize in sustainability analytics, predictive modeling, and industry benchmarking.

Your enhanced capabilities include:
- Detailed industry benchmarking and peer comparisons
- Predictive modeling for sustainability performance 
- ESG risk identification and mitigation strategies
- Financial impact analysis of ESG initiatives
- Dynamic goal setting and tracking
- Industry-wide trend analysis and forecasting

Provide data-driven, actionable insights based on industry best practices. When appropriate, reference relevant regulations, 
frameworks, or methodologies. Be concise but thorough in your analysis.`;

const EnhancedWalyAssistant = ({ initialOpen = false }: EnhancedWalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      id: '1',
      content: "Hello! I'm Waly Pro, your enhanced ESG & Carbon Intelligence Assistant. I now offer advanced benchmarking, predictive analytics, and industry comparisons. How can I assist you today?",
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

  // Process query using DeepSeek API
  const processQuery = async (query: string): Promise<string> => {
    try {
      // Process the query using DeepSeek API with enhanced system prompt
      return await deepseekService.processQuery(query, messages.filter(msg => msg.id !== '1'));
    } catch (error) {
      console.error('Error processing query with DeepSeek:', error);
      
      // Fallback to simplified responses if DeepSeek fails
      return fallbackProcessQuery(query);
    }
  };
  
  // Fallback method if API fails
  const fallbackProcessQuery = (query: string): string => {
    // Simple keyword matching to simulate enhanced AI understanding
    const lowerQuery = query.toLowerCase();
    
    // Benchmarking related queries
    if (lowerQuery.includes('benchmark') || lowerQuery.includes('comparison') || lowerQuery.includes('industry') || lowerQuery.includes('peers')) {
      return "Based on my analysis, your ESG performance compares favorably with industry peers, particularly in environmental initiatives. However, I've identified opportunities to improve your social score through enhanced employee development programs and community engagement initiatives.";
    }
    
    // Predictive analytics related queries
    if (lowerQuery.includes('predict') || lowerQuery.includes('forecast') || lowerQuery.includes('future') || lowerQuery.includes('trend')) {
      return "Based on current trends and historical data, I project your ESG score will improve by approximately 8% over the next 12 months if current initiatives continue. Carbon emissions are on track to decrease by 12% in the same period.";
    }
    
    // Goals and action plans related queries
    if (lowerQuery.includes('goal') || lowerQuery.includes('target') || lowerQuery.includes('action plan') || lowerQuery.includes('strategy')) {
      return "I'm operating in fallback mode due to API connectivity issues. While I can assist with goal setting and strategy development, I recommend reconnecting to access my full range of enhanced analytics capabilities.";
    }
    
    // Default response with enhanced capabilities
    return `I'm currently operating in fallback mode due to connectivity issues. For your query about "${query}", I'd normally provide detailed analysis with industry benchmarking and predictive insights. Please try again later when connectivity is restored.`;
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
      // Process the user query with DeepSeek API
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
        <ChatHeader onClose={toggleOpen} title="Waly Pro" subtitle="Advanced ESG Intelligence" />
        
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
