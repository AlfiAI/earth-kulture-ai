import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export const useChatPosition = () => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState(() => {
    // Fixed positions (in rem)
    return {
      bottom: 2, // 2rem from bottom regardless of device
      right: 2,  // 2rem from right regardless of device
    };
  });
  
  // Update position when screen size changes
  useEffect(() => {
    const updatePosition = () => {
      // Keep consistent positioning for better visibility
      // Same position for both mobile and desktop for consistency
      setPosition({
        bottom: 2,
        right: 2,
      });
    };
    
    // Update position initially
    updatePosition();
    
    // Update on resize
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [isMobile]);
  
  return position;
};
