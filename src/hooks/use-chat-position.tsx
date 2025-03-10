
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

/**
 * Simple hook to provide stable chat position with aggressive visibility enforcement
 */
export const useChatPosition = () => {
  const isMobile = useIsMobile();
  
  // Set position immediately without useState to avoid initial undefined state
  const position = { 
    bottom: isMobile ? 1.5 : 2, 
    right: isMobile ? 1.5 : 2 
  };
  
  // Debug position
  useEffect(() => {
    console.log('useChatPosition: Using position:', position);
    
    // Force visibility of Waly components
    const forceVisibility = () => {
      // Get all Waly-related elements
      const walyElements = [
        document.getElementById('waly-assistant-container'),
        document.getElementById('chat-button'),
        document.getElementById('waly-container'),
        document.getElementById('waly-root-container')
      ];
      
      // Apply aggressive styling to each element
      walyElements.forEach(el => {
        if (el) {
          el.style.cssText = `
            position: fixed !important;
            bottom: ${position.bottom}rem !important;
            right: ${position.right}rem !important;
            z-index: 9999999 !important;
            visibility: visible !important;
            display: block !important;
            opacity: 1 !important;
            pointer-events: auto !important;
          `;
        }
      });
    };
    
    // Run immediately and periodically
    forceVisibility();
    const interval = setInterval(forceVisibility, 300);
    
    return () => clearInterval(interval);
  }, [isMobile, position]);
  
  return position;
};
