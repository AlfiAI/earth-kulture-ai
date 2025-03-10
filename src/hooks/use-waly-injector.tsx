
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
          transform: none !important;
          will-change: auto !important;
          transition: none !important;
        `;
        
        // Add it to the body
        document.body.appendChild(walyContainer);
      }
      
      // Check if chat button exists and ensure its visibility
      const chatButton = document.getElementById('chat-button');
      if (chatButton) {
        chatButton.style.cssText = `
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
          z-index: 9999999 !important;
          position: fixed !important;
          bottom: 2rem !important;
          right: 2rem !important;
          pointer-events: auto !important;
          transform: none !important;
          will-change: auto !important;
          transition: none !important;
        `;
      }
    };
    
    // Run immediately
    injectWaly();
    
    // Also run on a more frequent timer (every 300ms)
    const interval = setInterval(injectWaly, 300);
    
    // Add event listeners to ensure visibility after DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(injectWaly, 0);
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true
    });
    
    // Also listen for page load events
    window.addEventListener('load', injectWaly);
    window.addEventListener('DOMContentLoaded', injectWaly);
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
      window.removeEventListener('load', injectWaly);
      window.removeEventListener('DOMContentLoaded', injectWaly);
    };
  }, []);
};
