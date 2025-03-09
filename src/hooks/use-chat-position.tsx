import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export const useChatPosition = () => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState(() => {
    // Default positions (in rem)
    const defaultPosition = {
      bottom: isMobile ? 2 : 2, // 1rem = 16px, positioned closer to the bottom
      right: isMobile ? 2 : 2,  // More space from the edge on desktop
    };
    
    return defaultPosition;
  });
  
  // Update position when screen size changes
  useEffect(() => {
    const updatePosition = () => {
      // Keep consistent positioning for better visibility
      const newPosition = {
        bottom: 2, // Consistent position for both mobile and desktop
        right: 2,  // Consistent position for both mobile and desktop
      };
      
      // Debug position updates
      console.log("Chat position updated:", newPosition);
      
      setPosition(newPosition);
    };
    
    // Update position initially and on resize
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    // Force update position after a short delay to ensure correct values
    const forceUpdateTimer = setTimeout(updatePosition, 500);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(forceUpdateTimer);
    };
  }, [isMobile]);
  
  return position;
};
