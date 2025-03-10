
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

/**
 * Simple hook to manage chat position ensuring it's always visible
 */
export const useChatPosition = () => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState({ 
    bottom: isMobile ? 1.5 : 2, 
    right: isMobile ? 1.5 : 2 
  });
  
  // Update position on resize and ensure visibility
  useEffect(() => {
    console.log('useChatPosition: Initializing position');
    
    const updatePosition = () => {
      // Adjust position based on device
      const newPosition = {
        bottom: isMobile ? 1.5 : 2,
        right: isMobile ? 1.5 : 2
      };
      
      setPosition(newPosition);
      
      // Force Waly visibility by directly setting element styles
      const walyContainer = document.getElementById('waly-assistant-container');
      const chatButton = document.getElementById('chat-button');
      
      if (walyContainer) {
        walyContainer.style.cssText = `
          position: fixed !important;
          bottom: ${newPosition.bottom}rem !important;
          right: ${newPosition.right}rem !important;
          z-index: 99999999 !important;
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        `;
      }
      
      if (chatButton) {
        chatButton.style.cssText = `
          position: fixed !important;
          bottom: ${newPosition.bottom}rem !important;
          right: ${newPosition.right}rem !important;
          z-index: 99999999 !important;
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        `;
      }
    };
    
    // Run immediately and on resize
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    // Also run periodically to ensure continuous visibility
    const interval = setInterval(updatePosition, 300);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      clearInterval(interval);
    };
  }, [isMobile]);
  
  return position;
};
