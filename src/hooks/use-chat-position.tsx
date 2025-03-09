
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
  
  // Force visibility of chat elements
  const forceVisibility = useCallback(() => {
    console.log("Forcing chat visibility - current route:", location.pathname);
    
    const chatButton = document.getElementById('chat-button');
    if (chatButton) {
      chatButton.style.visibility = 'visible';
      chatButton.style.opacity = '1';
      chatButton.style.display = 'block';
      chatButton.style.zIndex = '999999';
    }
    
    const walyContainer = document.getElementById('waly-container');
    if (walyContainer) {
      walyContainer.style.visibility = 'visible';
      walyContainer.style.opacity = '1';
      walyContainer.style.display = 'block';
      walyContainer.style.zIndex = '999999';
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
    
    // Set immediately
    updatePosition();
    
    // Also set on window resize
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
    const intervals = [100, 300, 500, 800, 1200, 2000, 3000, 5000].map(delay => 
      setTimeout(forceVisibility, delay)
    );
    
    // Also add a recurring interval to ensure visibility
    const recurringInterval = setInterval(forceVisibility, 10000);
    
    return () => {
      intervals.forEach(clearTimeout);
      clearInterval(recurringInterval);
    };
  }, [forceVisibility, location.pathname]);
  
  return position;
};
