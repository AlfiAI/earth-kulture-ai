
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export const useChatPosition = () => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState(() => {
    // Default positions (in rem)
    const defaultPosition = {
      bottom: isMobile ? 4 : 2, // 1rem = 16px
      right: isMobile ? 2 : 2,
    };
    
    return defaultPosition;
  });
  
  // Update position when screen size changes
  useEffect(() => {
    const updatePosition = () => {
      // Check if mobile and update position accordingly
      const newPosition = {
        bottom: isMobile ? 4 : 2,
        right: isMobile ? 2 : 2,
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
