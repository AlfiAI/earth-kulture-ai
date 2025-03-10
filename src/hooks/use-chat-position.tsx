
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

/**
 * Simplified hook to manage chat position and visibility
 */
export const useChatPosition = () => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState({ bottom: 2, right: 2 });
  
  // Update position on resize
  useEffect(() => {
    const updatePosition = () => {
      setPosition({
        bottom: isMobile ? 1.5 : 2,
        right: isMobile ? 1.5 : 2
      });
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => window.removeEventListener('resize', updatePosition);
  }, [isMobile]);
  
  return position;
};
