
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
  
  // Make sure Waly is visible
  const forceVisibility = useCallback(() => {
    // Handle index page specially
    const isIndexPage = location.pathname === '/';
    const isImportantPage = location.pathname === '/' || location.pathname === '/dashboard';
    
    // Apply visibility directly to DOM elements
    const chatButton = document.getElementById('chat-button');
    if (chatButton) {
      chatButton.style.visibility = 'visible';
      chatButton.style.opacity = '1';
      chatButton.style.display = 'block';
      chatButton.style.zIndex = '999999';
      chatButton.style.position = 'fixed';
      
      if (isImportantPage) {
        // For important pages, ensure it's really visible
        chatButton.style.pointerEvents = 'auto';
      }
    }
    
    const walyContainer = document.getElementById('waly-container');
    if (walyContainer) {
      walyContainer.style.visibility = 'visible';
      walyContainer.style.opacity = '1';
      walyContainer.style.display = 'block';
      walyContainer.style.zIndex = '999999';
      walyContainer.style.position = 'fixed';
      
      if (isImportantPage) {
        // For important pages, ensure it's really visible
        walyContainer.style.pointerEvents = 'auto';
      }
    }
  }, [location.pathname]);
  
  // Update position when screen size changes
  useEffect(() => {
    const updatePosition = () => {
      // Same position for both mobile and desktop for simplicity and reliability
      setPosition({
        bottom: 2,
        right: 2,
      });
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [isMobile]);
  
  // Always force the chat button to be visible
  useEffect(() => {
    // Immediate call
    forceVisibility();
    
    // Call multiple times with increasing delays to handle any race conditions
    const timeouts = [100, 300, 500, 800, 1200, 2000, 5000].map(delay => 
      setTimeout(forceVisibility, delay)
    );
    
    // For important pages, use more aggressive approach
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      console.log("Important page detected - using enhanced visibility measures");
      const indexInterval = setInterval(forceVisibility, 1000);
      
      return () => {
        timeouts.forEach(clearTimeout);
        clearInterval(indexInterval);
      };
    }
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [forceVisibility, location.pathname]);
  
  return position;
};
