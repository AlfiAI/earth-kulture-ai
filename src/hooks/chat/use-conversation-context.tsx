
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { esgDataService } from '@/services/esgDataService';

// Define the PageContext interface to fix TypeScript errors
interface PageContext {
  path: string;
  pageType?: string;
  carbonFootprint?: number;
  [key: string]: any; // Allow for additional properties
}

export interface ConversationContextState {
  recentTopics: string[];
  userPreferences: Record<string, any>;
  pageContext: PageContext;
}

export function useConversationContext() {
  const [conversationContext, setConversationContext] = useState<ConversationContextState>({
    recentTopics: [],
    userPreferences: {},
    pageContext: { path: '/' },
  });
  const location = useLocation();

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

  // Update conversation context for better contextual understanding
  const updateConversationContext = (query: string) => {
    // Determine the intent of the query from the deepseekR1Service
    const intent = query; // Simplified for now
    
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

  return {
    conversationContext,
    updateConversationContext
  };
}
