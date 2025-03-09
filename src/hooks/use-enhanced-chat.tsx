
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { MessageProps } from '@/components/ai/Message';
import { deepseekR1Service } from '@/services/ai/deepseekR1Service';
import { enhancedAIContext, ENHANCED_SYSTEM_PROMPT } from '@/components/ai/constants/enhancedAIContext';
import { walyAIService } from '@/services/ai/walyAIService';
import { useLocation, useNavigate } from 'react-router-dom';
import { esgDataService } from '@/services/esgDataService';

// Define the PageContext interface to fix TypeScript errors
interface PageContext {
  path: string;
  pageType?: string;
  carbonFootprint?: number;
  [key: string]: any; // Allow for additional properties
}

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
    pageContext: {} as PageContext,
  });
  const location = useLocation();
  const navigate = useNavigate();
  
  // Update page context when route changes
  useEffect(() => {
    const updatePageContext = async () => {
      try {
        const currentPath = location.pathname;
        let pageData: PageContext = { path: currentPath };
        
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
        } else if (currentPath.includes('about')) {
          pageData = {
            ...pageData,
            pageType: 'about'
          };
        } else if (currentPath === '/') {
          pageData = {
            ...pageData,
            pageType: 'home'
          };
        } else if (currentPath.includes('auth')) {
          pageData = {
            ...pageData,
            pageType: 'auth'
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

  // Enhanced function to check navigation intent and action commands
  const analyzeUserIntent = (query: string): {
    navigateTo?: string;
    performAction?: string;
    actionParams?: Record<string, any>;
  } => {
    const lowercaseQuery = query.toLowerCase();
    
    // Check for navigation intent
    if (lowercaseQuery.includes('go to') || lowercaseQuery.includes('take me to') || 
        lowercaseQuery.includes('navigate to') || lowercaseQuery.includes('show me the')) {
      
      const navigationMapping: Record<string, string> = {
        'dashboard': '/',
        'home': '/',
        'analytics': '/analytics',
        'compliance': '/compliance',
        'benchmark': '/benchmark',
        'benchmarking': '/benchmark',
        'data': '/data',
        'reports': '/reports',
        'goals': '/goals',
        'settings': '/settings',
        'insights': '/insights',
        'sign up': '/signup',
        'sign in': '/auth',
        'login': '/auth',
        'register': '/signup',
        'about': '/about'
      };
      
      for (const [keyword, path] of Object.entries(navigationMapping)) {
        if (lowercaseQuery.includes(keyword)) {
          return { navigateTo: path };
        }
      }
    }
    
    // Check for authentication actions
    if (lowercaseQuery.includes('sign me up') || lowercaseQuery.includes('create account') || 
        lowercaseQuery.includes('register me')) {
      return { 
        navigateTo: '/auth',
        performAction: 'signup'
      };
    }
    
    if (lowercaseQuery.includes('log me in') || lowercaseQuery.includes('sign me in')) {
      return { 
        navigateTo: '/auth',
        performAction: 'login'
      };
    }
    
    // Check for specific actions based on current page
    if (conversationContext.pageContext.pageType === 'analytics' && 
        (lowercaseQuery.includes('show chart') || lowercaseQuery.includes('view emissions'))) {
      return { performAction: 'showChart', actionParams: { type: 'emissions' } };
    }
    
    if (conversationContext.pageContext.pageType === 'benchmark' && 
        lowercaseQuery.includes('compare with competitors')) {
      return { performAction: 'runBenchmark' };
    }
    
    if (lowercaseQuery.includes('fill form') || lowercaseQuery.includes('fill out form')) {
      // Extract form data from the query (simplified implementation)
      const actionParams: Record<string, any> = {};
      
      if (lowercaseQuery.includes('email')) {
        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
        const emailMatch = query.match(emailRegex);
        if (emailMatch) {
          actionParams.email = emailMatch[0];
        }
      }
      
      if (lowercaseQuery.includes('name')) {
        const nameRegex = /name[:\s]+([a-zA-Z\s]+)/i;
        const nameMatch = query.match(nameRegex);
        if (nameMatch && nameMatch[1]) {
          actionParams.name = nameMatch[1].trim();
        }
      }
      
      if (lowercaseQuery.includes('password')) {
        actionParams.needsPassword = true;
      }
      
      return { performAction: 'fillForm', actionParams };
    }
    
    return {};
  };

  // Function to execute actions based on intent
  const executeUserIntent = async (intent: ReturnType<typeof analyzeUserIntent>) => {
    if (intent.navigateTo) {
      // Add a small delay before navigation to allow the AI response to be displayed
      setTimeout(() => {
        navigate(intent.navigateTo!);
        toast.info(`Navigating to ${intent.navigateTo}`);
      }, 1000);
    }
    
    if (intent.performAction) {
      switch (intent.performAction) {
        case 'login':
        case 'signup':
          // Will be handled by UI after navigation
          // We'll use an event to communicate this to the auth form
          const authEvent = new CustomEvent('waly-auth-action', { 
            detail: { action: intent.performAction, params: intent.actionParams } 
          });
          window.dispatchEvent(authEvent);
          break;
          
        case 'fillForm':
          // Dispatch an event that components can listen for
          const formEvent = new CustomEvent('waly-fill-form', { 
            detail: { fields: intent.actionParams } 
          });
          window.dispatchEvent(formEvent);
          break;
          
        case 'showChart':
        case 'runBenchmark':
          // Dispatch events for these actions
          const actionEvent = new CustomEvent('waly-action', { 
            detail: { action: intent.performAction, params: intent.actionParams } 
          });
          window.dispatchEvent(actionEvent);
          break;
          
        default:
          console.log('Unknown action:', intent.performAction);
      }
    }
  };

  const handleSend = async () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: MessageProps = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Analyze user intent from the message
    const userIntent = analyzeUserIntent(inputValue);
    
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
Available routes: dashboard, analytics, compliance, benchmark, data, reports, goals, settings, insights, auth, signup, about
`;
      
      // Process the user query with DeepSeek R1 service
      let aiResponse = await deepseekR1Service.processQuery(
        userMessage.content, 
        messages.filter(msg => msg.id !== '1'), 
        customizedPrompt
      );
      
      // If navigation intent was detected, add the navigation command to the response
      if (userIntent.navigateTo && !aiResponse.includes('[NAVIGATE:')) {
        const routeName = userIntent.navigateTo.replace('/', '');
        aiResponse += ` [NAVIGATE:${routeName || 'dashboard'}]`;
      }
      
      const aiMessage: MessageProps = {
        id: Date.now().toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Execute the user intent after the AI has responded
      await executeUserIntent(userIntent);
      
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
