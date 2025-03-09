
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
    console.log("Forcing chat visibility - current route:", location.pathname);
    
    // Handle index page specially
    const isIndexPage = location.pathname === '/';
    
    // Apply visibility directly to DOM elements
    const chatButton = document.getElementById('chat-button');
    if (chatButton) {
      chatButton.style.visibility = 'visible';
      chatButton.style.opacity = '1';
      chatButton.style.display = 'block';
      chatButton.style.zIndex = '999999';
      
      if (isIndexPage) {
        // For index page, ensure it's really visible
        chatButton.style.pointerEvents = 'auto';
        chatButton.style.position = 'fixed';
      }
    }
    
    const walyContainer = document.getElementById('waly-container');
    if (walyContainer) {
      walyContainer.style.visibility = 'visible';
      walyContainer.style.opacity = '1';
      walyContainer.style.display = 'block';
      walyContainer.style.zIndex = '999999';
      
      if (isIndexPage) {
        // For index page, ensure it's really visible
        walyContainer.style.pointerEvents = 'auto';
        walyContainer.style.position = 'fixed';
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
    const intervals = [100, 300, 500, 800, 1200, 2000].map(delay => 
      setTimeout(forceVisibility, delay)
    );
    
    // For index page, use more aggressive approach
    if (location.pathname === '/') {
      console.log("Index page detected - using enhanced visibility measures");
      const indexIntervals = setInterval(forceVisibility, 1000);
      return () => {
        intervals.forEach(clearTimeout);
        clearInterval(indexIntervals);
      };
    }
    
    return () => {
      intervals.forEach(clearTimeout);
    };
  }, [forceVisibility, location.pathname]);
  
  return position;
};
