
import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from './use-mobile';
import { useLocation } from 'react-router-dom';

export const useChatPosition = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const [position, setPosition] = useState(() => {
    // Fixed positions (in rem)
    return {
      bottom: 2, // 2rem from bottom
      right: 2,  // 2rem from right
    };
  });
  
  // Make sure Waly is visible with extremely aggressive approach
  const forceVisibility = useCallback(() => {
    console.log("Force visibility called on path:", location.pathname);
    
    // Apply visibility directly to DOM elements with !important styles
    const chatButton = document.getElementById('chat-button');
    if (chatButton) {
      chatButton.setAttribute('style', `
        visibility: visible !important;
        opacity: 1 !important;
        display: block !important;
        z-index: 9999999 !important;
        position: fixed !important;
        bottom: ${position.bottom}rem !important;
        right: ${position.right}rem !important;
        pointer-events: auto !important;
        transform: none !important;
      `);
    } else {
      console.warn("Chat button element not found in DOM");
    }
    
    const walyContainer = document.getElementById('waly-container');
    if (walyContainer) {
      walyContainer.setAttribute('style', `
        visibility: visible !important;
        opacity: 1 !important;
        display: block !important;
        z-index: 9999999 !important;
        position: fixed !important;
        pointer-events: auto !important;
      `);
    } else {
      console.warn("Waly container element not found in DOM");
    }
    
    // Also try to find any potential parent elements that might be hiding Waly
    document.querySelectorAll('[id*="waly"], [id*="chat"], [class*="waly"], [class*="chat"]')
      .forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.display = el.style.display === 'none' ? 'block' : el.style.display;
          el.style.zIndex = '9999999';
        }
      });
  }, [location.pathname, position]);
  
  // Update position when screen size changes
  useEffect(() => {
    const updatePosition = () => {
      // Same position for both mobile and desktop for simplicity and reliability
      setPosition({
        bottom: 2,
        right: 2,
      });
      
      // Also force visibility when position changes
      forceVisibility();
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [isMobile, forceVisibility]);
  
  // Always force the chat button to be visible with multiple strategies
  useEffect(() => {
    console.log("Setting up Waly visibility for path:", location.pathname);
    
    // Immediate call
    forceVisibility();
    
    // Call multiple times with increasing delays to handle any race conditions
    const timeouts = [50, 100, 200, 300, 500, 800, 1200, 2000, 5000, 10000].map(delay => 
      setTimeout(forceVisibility, delay)
    );
    
    // For any page, use aggressive approach
    const visibilityInterval = setInterval(forceVisibility, 1000);
    
    // Use MutationObserver to detect DOM changes that might affect Waly visibility
    const observer = new MutationObserver(() => {
      forceVisibility();
    });
    
    // Start observing the document body for all changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true
    });
    
    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(visibilityInterval);
      observer.disconnect();
    };
  }, [forceVisibility, location.pathname]);
  
  return position;
};
