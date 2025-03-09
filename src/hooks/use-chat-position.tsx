
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
      // Check if mobile and update position accordingly
      const newPosition = {
        bottom: isMobile ? 2 : 2, // Same for both for consistency
        right: isMobile ? 2 : 2,  // More space from the edge on desktop
      };
      
      // Debug position updates
      console.log("Chat position updated:", newPosition);
      
      setPosition(newPosition);
    };
    
    // Update position initially and on resize
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => window.removeEventListener('resize', updatePosition);
  }, [isMobile]);
  
  return position;
};
