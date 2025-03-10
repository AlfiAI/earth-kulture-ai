
import { useEffect } from 'react';

/**
 * Enhanced hook to forcefully ensure Waly chat bubble is always visible
 * Uses even more aggressive DOM manipulation with unremovable styling
 */
export const useWalyInjector = () => {
  useEffect(() => {
    console.log('Enhanced Waly injector activated');
    
    // Function to force Waly visibility with extremely aggressive styling
    const forceWalyVisibility = () => {
      // Create or get the waly container
      let container = document.getElementById('waly-container');
      if (!container) {
        console.log('Creating new Waly container');
        container = document.createElement('div');
        container.id = 'waly-container';
        container.dataset.protected = 'true'; // Mark as protected
        document.body.appendChild(container);
      }
      
      // Apply extremely aggressive styling with !important flags
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
        transform: none !important;
        transition: none !important;
        clip-path: none !important;
        -webkit-clip-path: none !important;
      `;
      
      // Find all possible Waly-related elements and enforce visibility
      const walyElements = [
        document.getElementById('waly-assistant-container'),
        document.getElementById('chat-button'),
        document.getElementById('waly-root-container'),
      ];
      
      walyElements.forEach(el => {
        if (el) {
          el.style.cssText = `
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
            transform: none !important;
            transition: none !important;
            clip-path: none !important;
            -webkit-clip-path: none !important;
          `;
        }
      });
    };
    
    // Run immediately
    forceWalyVisibility();
    
    // Run on a frequent interval to ensure continuous visibility
    const interval = setInterval(forceWalyVisibility, 200);
    
    // Also use MutationObserver to catch any DOM changes
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
