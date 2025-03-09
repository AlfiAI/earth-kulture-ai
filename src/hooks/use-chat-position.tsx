
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export const useChatPosition = () => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState(() => {
    // Default positions (in rem)
    const defaultPosition = {
      bottom: isMobile ? 4 : 4, // 1rem = 16px, increased slightly for better visibility
      right: isMobile ? 2 : 4,  // More space from the edge on desktop
    };
    
    return defaultPosition;
  });
  
  // Update position when screen size changes
  useEffect(() => {
    const updatePosition = () => {
      // Check if mobile and update position accordingly
      const newPosition = {
        bottom: isMobile ? 4 : 4, // Same for both for consistency
        right: isMobile ? 2 : 4,  // More space from the edge on desktop
      };
      
      // Debug position updates
      console.log("Updating chat position:", newPosition);
      
      setPosition(newPosition);
    };
    
    // Update position initially and on resize
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => window.removeEventListener('resize', updatePosition);
  }, [isMobile]);
  
  return position;
};
