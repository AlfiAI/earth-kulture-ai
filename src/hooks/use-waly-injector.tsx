
import { useEffect } from 'react';

/**
 * Forceful hook to ensure Waly chat bubble is always visible
 * Uses direct DOM manipulation with aggressive styling
 */
export const useWalyInjector = () => {
  useEffect(() => {
    console.log('Waly injector activated');
    
    // Function to force Waly visibility
    const forceWalyVisibility = () => {
      // Create or get the waly-container
      let container = document.getElementById('waly-container');
      if (!container) {
        console.log('Creating new Waly container');
        container = document.createElement('div');
        container.id = 'waly-container';
        document.body.appendChild(container);
      }
      
      // Apply aggressive styling to ensure visibility
      container.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 99999999 !important;
        visibility: visible !important;
        display: block !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        width: auto !important;
        height: auto !important;
        overflow: visible !important;
      `;
      
      // Also ensure the chat button is visible if it exists
      const chatButton = document.getElementById('chat-button');
      if (chatButton) {
        chatButton.style.cssText = `
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 99999999 !important;
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          width: auto !important;
          height: auto !important;
          overflow: visible !important;
        `;
      }
    };
    
    // Run immediately
    forceWalyVisibility();
    
    // Run on a constant interval to ensure continuous visibility
    const interval = setInterval(forceWalyVisibility, 500);
    
    // Also use MutationObserver to detect DOM changes
    const observer = new MutationObserver(() => {
      forceWalyVisibility();
    });
    
    observer.observe(document.body, { 
      childList: true, 
      attributes: true, 
      subtree: true 
    });
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);
};
