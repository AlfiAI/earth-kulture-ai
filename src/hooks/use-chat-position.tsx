
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export const useChatPosition = () => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState(() => {
    // Fixed positions (in rem)
    return {
      bottom: 2, // 2rem from bottom
      right: 2,  // 2rem from right
    };
  });
  
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
    const forceVisibility = () => {
      const chatButton = document.getElementById('chat-button');
      if (chatButton) {
        chatButton.style.visibility = 'visible';
        chatButton.style.opacity = '1';
        chatButton.style.display = 'block';
        chatButton.style.zIndex = '999999';
        console.log("Force chat button visibility from position hook");
      }
      
      const walyContainer = document.getElementById('waly-container');
      if (walyContainer) {
        walyContainer.style.visibility = 'visible';
        walyContainer.style.opacity = '1';
        walyContainer.style.display = 'block';
        walyContainer.style.zIndex = '999999';
        console.log("Force waly container visibility from position hook");
      }
    };
    
    // Call immediately and every 500ms for the first few seconds
    forceVisibility();
    const intervals = [100, 500, 1000, 1500, 2000, 3000].map(delay => 
      setTimeout(forceVisibility, delay)
    );
    
    return () => intervals.forEach(clearTimeout);
  }, []);
  
  return position;
};
