
import { useEffect } from 'react';

/**
 * This hook serves as a backup mechanism to ensure Waly is always visible
 * by injecting it directly into the DOM if it's not found
 */
export const useWalyInjector = () => {
  useEffect(() => {
    const injectWaly = () => {
      // Check if Waly container exists
      if (!document.getElementById('waly-container')) {
        console.log('Waly container not found, injecting it directly');
        
        // Create the container
        const walyContainer = document.createElement('div');
        walyContainer.id = 'waly-container';
        walyContainer.className = 'fixed bottom-0 right-0 z-[9999999]';
        walyContainer.style.cssText = `
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
          z-index: 9999999 !important;
          position: fixed !important;
          bottom: 2rem !important;
          right: 2rem !important;
          pointer-events: auto !important;
        `;
        
        // Add it to the body
        document.body.appendChild(walyContainer);
        
        // Try to render EnhancedWalyAssistant into this container
        // This requires programmatic React rendering, which should be
        // handled by the main App component, but this is a backup
      }
      
      // Check if chat button exists
      if (!document.getElementById('chat-button')) {
        console.log('Chat button not found, may need injection');
        // The actual button will be rendered by React components
        // This is just a monitoring function
      }
    };
    
    // Run immediately
    injectWaly();
    
    // Also run on a timer
    const interval = setInterval(injectWaly, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
};
