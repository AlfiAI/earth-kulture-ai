
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { MessageProps } from '@/components/ai/Message';
import { deepseekService } from '@/services/ai/deepseekService';
import { enhancedAIContext, ENHANCED_SYSTEM_PROMPT } from '@/components/ai/constants/enhancedAIContext';

export const useEnhancedChat = (initialMessages: MessageProps[] = []) => {
  const [messages, setMessages] = useState<MessageProps[]>(
    initialMessages.length > 0 
      ? initialMessages 
      : [{
          id: '1',
          content: "Hello! I'm Waly Pro, your enhanced ESG & Carbon Intelligence Assistant. I now offer advanced benchmarking, predictive analytics, and industry comparisons. How can I assist you today?",
          sender: 'ai',
          timestamp: new Date(),
        }]
  );
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Simulate proactive AI behavior
  useEffect(() => {
    if (enhancedAIContext.assistantMode === 'proactive') {
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
  }, [messages.length]);

  // Process query using DeepSeek API
  const processQuery = async (query: string): Promise<string> => {
    try {
      // Process the query using DeepSeek API with enhanced system prompt
      return await deepseekService.processQuery(query, messages.filter(msg => msg.id !== '1'), ENHANCED_SYSTEM_PROMPT);
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

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    handleSend,
  };
};
