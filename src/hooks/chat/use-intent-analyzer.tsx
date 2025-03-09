
import { useCallback } from 'react';
import { deepseekR1Service } from '@/services/ai/deepseekR1Service';

export interface UserIntent {
  navigateTo?: string;
  performAction?: string;
  actionParams?: Record<string, any>;
}

export function useIntentAnalyzer() {
  // Enhanced function to check navigation intent and action commands
  const analyzeUserIntent = useCallback((query: string, pageContext: any): UserIntent => {
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
    if (pageContext.pageType === 'analytics' && 
        (lowercaseQuery.includes('show chart') || lowercaseQuery.includes('view emissions'))) {
      return { performAction: 'showChart', actionParams: { type: 'emissions' } };
    }
    
    if (pageContext.pageType === 'benchmark' && 
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
  }, []);

  // Categorize user intent based on query content
  const categorizeIntent = useCallback((query: string) => {
    return deepseekR1Service.categorizeIntent(query);
  }, []);

  return {
    analyzeUserIntent,
    categorizeIntent
  };
}
