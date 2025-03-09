
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
    console.log("useChatPosition hook initialized");
    
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
      
      const newPosition = { bottom: bottomOffset, right: rightOffset };
      setPosition(newPosition);
    };

    // Handle window resize
    const handleResize = () => {
      // Adjust position if needed based on window size
      if (isMobile) {
        setPosition({ bottom: 20, right: 20 });
      } else {
        // Check for elements that might be in the way on desktop
        const handleLayout = () => {
          const sidebar = document.querySelector('[data-component="sidebar"]');
          if (sidebar instanceof HTMLElement) {
            const rect = sidebar.getBoundingClientRect();
            setPosition({ bottom: 20, right: Math.max(20, rect.width / 16 + 20) });
          } else {
            setPosition({ bottom: 20, right: 20 });
          }
        };
        
        handleLayout();
      }
    };

    // Initial position check
    handleResize();
    handleScroll();
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
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
    };
  }, [isMobile]);

  return position;
};
