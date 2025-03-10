
import { useEffect } from 'react';

/**
 * A simplified hook that ensures Waly is always visible by injecting it into the DOM
 * This version uses a more direct approach with fewer intervals and listeners
 */
export const useWalyInjector = () => {
  useEffect(() => {
    // Simple function to inject and ensure Waly container exists
    const injectWaly = () => {
      // Check if container exists, create if not
      if (!document.getElementById('waly-container')) {
        console.log('Creating Waly container');
        const container = document.createElement('div');
        container.id = 'waly-container';
        container.style.cssText = `
          position: fixed !important;
          bottom: 2rem !important;
          right: 2rem !important;
          z-index: 9999999 !important;
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
        `;
        document.body.appendChild(container);
      }
      
      // Ensure chat button is visible if it exists
      const chatButton = document.getElementById('chat-button');
      if (chatButton) {
        chatButton.style.cssText = `
          position: fixed !important;
          bottom: 2rem !important;
          right: 2rem !important;
          z-index: 9999999 !important;
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
        `;
      }
    };
    
    // Run immediately
    injectWaly();
    
    // Run on a short interval for the first 10 seconds
    const interval = setInterval(injectWaly, 500);
    setTimeout(() => clearInterval(interval), 10000);
    
    // Also run when DOM changes (simplified observer)
    const observer = new MutationObserver(injectWaly);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);
};
