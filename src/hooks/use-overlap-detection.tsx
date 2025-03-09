
import { useState, useEffect } from 'react';

export const useOverlapDetection = (elementId: string) => {
  const [isOverlapping, setIsOverlapping] = useState(false);
  
  useEffect(() => {
    const checkOverlap = () => {
      const element = document.getElementById(elementId);
      if (!element) return;
      
      const elementRect = element.getBoundingClientRect();
      
      // Check all clickable elements (buttons, links, etc.)
      const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, select, textarea');
      
      let overlapping = false;
      interactiveElements.forEach(interactiveElement => {
        if (interactiveElement === element) return; // Skip self
        
        const interactiveRect = interactiveElement.getBoundingClientRect();
        
        // Check if the elements overlap
        if (
          elementRect.right > interactiveRect.left &&
          elementRect.left < interactiveRect.right &&
          elementRect.bottom > interactiveRect.top &&
          elementRect.top < interactiveRect.bottom
        ) {
          overlapping = true;
        }
      });
      
      setIsOverlapping(overlapping);
    };
    
    // Check overlap initially and on window resize
    checkOverlap();
    window.addEventListener('resize', checkOverlap);
    window.addEventListener('scroll', checkOverlap);
    
    // Recheck periodically for dynamic content changes
    const intervalId = setInterval(checkOverlap, 1000);
    
    return () => {
      window.removeEventListener('resize', checkOverlap);
      window.removeEventListener('scroll', checkOverlap);
      clearInterval(intervalId);
    };
  }, [elementId]);

  return isOverlapping;
};
