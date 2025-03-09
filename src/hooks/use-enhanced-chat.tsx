
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { MessageProps } from '@/components/ai/Message';
import { deepseekR1Service } from '@/services/ai/deepseekR1Service';
import { enhancedAIContext, ENHANCED_SYSTEM_PROMPT } from '@/components/ai/constants/enhancedAIContext';
import { walyAIService } from '@/services/ai/walyAIService';
import { useLocation } from 'react-router-dom';
import { esgDataService } from '@/services/esgDataService';

export const useEnhancedChat = (initialMessages: MessageProps[] = []) => {
  const [messages, setMessages] = useState<MessageProps[]>(
    initialMessages.length > 0 
      ? initialMessages 
      : [walyAIService.getEnhancedWelcomeMessage()]
  );
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    recentTopics: [] as string[],
    userPreferences: {} as Record<string, any>,
    pageContext: {} as Record<string, any>,
  });
  const location = useLocation();
  
  // Update page context when route changes
  useEffect(() => {
    const updatePageContext = async () => {
      try {
        const currentPath = location.pathname;
        let pageData = { path: currentPath };
        
        // Load relevant data for the current page
        if (currentPath.includes('analytics')) {
          const emissions = await esgDataService.getCarbonEmissions();
          pageData = {
            ...pageData,
            pageType: 'analytics',
            carbonFootprint: esgDataService.calculateCarbonFootprint(emissions)
          };
        } else if (currentPath.includes('benchmark')) {
          pageData = {
            ...pageData,
            pageType: 'benchmarking'
          };
        } else if (currentPath.includes('compliance')) {
          pageData = {
            ...pageData,
            pageType: 'compliance'
          };
        }
        
        setConversationContext(prev => ({
          ...prev,
          pageContext: pageData
        }));
      } catch (error) {
        console.error('Error updating page context:', error);
      }
    };
    
    updatePageContext();
  }, [location.pathname]);
  
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

  // Update conversation context for better contextual understanding
  const updateConversationContext = (query: string) => {
    // Determine the intent of the query
    const intent = deepseekR1Service.categorizeIntent(query);
    
    // Update recent topics (max 5)
    setConversationContext(prev => {
      const updatedTopics = [intent, ...prev.recentTopics.slice(0, 4)];
      
      // Extract preferences (simple implementation)
      const updatedPreferences = { ...prev.userPreferences };
      if (query.toLowerCase().includes('prefer') || query.toLowerCase().includes('like')) {
        const preference = query.split(' ').slice(-1)[0].toLowerCase();
        updatedPreferences[preference] = true;
      }
      
      return {
        ...prev,
        recentTopics: updatedTopics,
        userPreferences: updatedPreferences
      };
    });
  };

  // Function to check if the query contains navigation intent
  const checkForNavigationIntent = (query: string): string | null => {
    const navigationKeywords = {
      'dashboard': '/',
      'analytics': '/analytics',
      'compliance': '/compliance',
      'benchmark': '/benchmark',
      'benchmarking': '/benchmark',
      'data': '/data',
      'reports': '/reports',
      'goals': '/goals',
      'settings': '/settings',
      'insights': '/insights',
    };
    
    const lowercaseQuery = query.toLowerCase();
    
    // Check for explicit navigation requests
    if (lowercaseQuery.includes('go to') || lowercaseQuery.includes('take me to') || 
        lowercaseQuery.includes('navigate to') || lowercaseQuery.includes('show me the')) {
      for (const [keyword, path] of Object.entries(navigationKeywords)) {
        if (lowercaseQuery.includes(keyword)) {
          return path;
        }
      }
    }
    
    return null;
  };

  const handleSend = async () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: MessageProps = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Check for navigation intents
    const navigationPath = checkForNavigationIntent(inputValue);
    
    // Update conversation context based on user message
    updateConversationContext(inputValue);
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Create a customized system prompt incorporating conversation context and page context
      const customizedPrompt = `${ENHANCED_SYSTEM_PROMPT}
      
Current conversation context:
- Page: ${conversationContext.pageContext.path || 'Unknown'}
- Page type: ${conversationContext.pageContext.pageType || 'General'}
- Recent topics: ${conversationContext.recentTopics.join(', ')}
- User preferences: ${Object.keys(conversationContext.userPreferences).join(', ')}

You have the ability to help users navigate through the application by including [NAVIGATE:route-name] in your responses when appropriate.
For example: "Let me show you the dashboard [NAVIGATE:dashboard]" or "I'll take you to the analytics page [NAVIGATE:analytics]"

Only use this when the user specifically asks to be taken to a different page, not for every response.
Available routes: dashboard, analytics, compliance, benchmark, data, reports, goals, settings, insights
`;
      
      // Process the user query with DeepSeek R1 service
      let aiResponse = await deepseekR1Service.processQuery(
        userMessage.content, 
        messages.filter(msg => msg.id !== '1'), 
        customizedPrompt
      );
      
      // If navigation intent was detected, add the navigation command to the response
      if (navigationPath) {
        if (!aiResponse.includes('[NAVIGATE:')) {
          aiResponse += ` [NAVIGATE:${navigationPath.replace('/', '')}]`;
        }
      }
      
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
    conversationContext
  };
};
