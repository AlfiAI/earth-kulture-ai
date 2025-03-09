import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

interface Position {
  bottom: number;
  right: number;
}

export const useChatPosition = (initialPosition: Position = { bottom: 20, right: 20 }) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const isMobile = useIsMobile();
  
  // Handle scrolling and resizing
  useEffect(() => {
    console.log("useChatPosition hook initialized with default position:", initialPosition);
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollBottom = scrollY + viewportHeight;
      const threshold = documentHeight - 200;
      
      // Check for elements that might be in the way
      const footerElement = document.querySelector('footer');
      const bottomElements = document.querySelectorAll('.fixed-bottom, [data-fixed="bottom"]');
      
      // Default bottom offset (in pixels, not rem)
      let bottomOffset = isMobile ? 20 : 20;
      
      // Adjust for footer or other bottom-fixed elements
      if (footerElement && scrollBottom >= documentHeight - footerElement.clientHeight - 100) {
        bottomOffset = footerElement.clientHeight + 20;
      }
      
      // Check for any elements with fixed positioning at the bottom
      bottomElements.forEach(element => {
        if (element instanceof HTMLElement) {
          const rect = element.getBoundingClientRect();
          if (rect.bottom > window.innerHeight - 100) {
            bottomOffset = Math.max(bottomOffset, window.innerHeight - rect.top + 20);
          }
        }
      });
      
      // Adjust for near bottom of page scenarios
      if (scrollBottom >= threshold) {
        bottomOffset = Math.max(bottomOffset, 40);
      }
      
      // Determine right offset (avoid horizontal scrollbar)
      const rightOffset = isMobile ? 20 : 20;
      
      // Add a minimum offset to ensure visibility
      bottomOffset = Math.max(bottomOffset, 20);
      
      const newPosition = { bottom: bottomOffset, right: rightOffset };
      console.log("Setting chat position to:", newPosition);
      setPosition(newPosition);
    };

    // Handle window resize
    const handleResize = () => {
      // Adjust position based on window size
      if (isMobile) {
        console.log("Setting mobile chat position");
        setPosition({ bottom: 20, right: 20 });
      } else {
        console.log("Setting desktop chat position");
        // Always ensure the button is visible with a minimum offset
        setPosition({ bottom: 20, right: 20 });
      }
    };

    // Initial position check
    handleResize();
    handleScroll();
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Force a position update after a short delay to ensure UI has fully rendered
    const forceUpdateTimer = setTimeout(() => {
      handleResize();
      handleScroll();
    }, 1000);
    
    // Use a mutation observer to detect DOM changes that might affect positioning
    const observer = new MutationObserver(() => {
      handleScroll();
      handleResize();
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      clearTimeout(forceUpdateTimer);
    };
  }, [isMobile, initialPosition]);

  return position;
};
