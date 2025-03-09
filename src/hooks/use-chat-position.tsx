
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export const useChatPosition = () => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState(() => {
    // Default positions (in rem)
    return {
      bottom: 2, // 2rem from bottom regardless of device
      right: 2,  // 2rem from right regardless of device
    };
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
    
    // Update position initially
    updatePosition();
    
    // Update on resize
    window.addEventListener('resize', updatePosition);
    
    // Force update position after a short delay to ensure correct values
    const forceUpdateTimer = setTimeout(updatePosition, 200);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(forceUpdateTimer);
    };
  }, [isMobile]);
  
  return position;
};
