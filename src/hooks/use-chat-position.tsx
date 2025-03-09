
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

interface Position {
  bottom: number;
  right: number;
}

export const useChatPosition = (initialPosition: Position = { bottom: 4, right: 4 }) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const isMobile = useIsMobile();
  
  // Handle scrolling and resizing
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollBottom = scrollY + viewportHeight;
      const threshold = documentHeight - 200;
      
      // Check for elements that might be in the way
      const footerElement = document.querySelector('footer');
      const bottomElements = document.querySelectorAll('.fixed-bottom, [data-fixed="bottom"]');
      
      let bottomOffset = 4;
      
      // Adjust for footer or other bottom-fixed elements
      if (footerElement && scrollBottom >= documentHeight - footerElement.clientHeight - 100) {
        bottomOffset = footerElement.clientHeight + 6;
      }
      
      // Check for any elements with fixed positioning at the bottom
      bottomElements.forEach(element => {
        if (element instanceof HTMLElement) {
          const rect = element.getBoundingClientRect();
          if (rect.bottom > window.innerHeight - 100) {
            bottomOffset = Math.max(bottomOffset, window.innerHeight - rect.top + 2);
          }
        }
      });
      
      // Adjust for near bottom of page scenarios
      if (scrollBottom >= threshold) {
        bottomOffset = Math.max(bottomOffset, 20);
      }
      
      // Determine right offset (avoid horizontal scrollbar)
      const rightOffset = isMobile ? 2 : 4;
      
      setPosition({ bottom: bottomOffset, right: rightOffset });
    };

    // Handle window resize
    const handleResize = () => {
      // Adjust position if needed based on window size
      if (isMobile) {
        setPosition({ bottom: 2, right: 2 });
      } else {
        // Check for elements that might be in the way on desktop
        const handleLayout = () => {
          const sidebar = document.querySelector('[data-component="sidebar"]');
          if (sidebar instanceof HTMLElement) {
            const rect = sidebar.getBoundingClientRect();
            setPosition({ bottom: 4, right: Math.max(4, rect.width / 16 + 2) });
          } else {
            setPosition({ bottom: 4, right: 4 });
          }
        };
        
        handleLayout();
      }
    };

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

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial position check
    handleResize();
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [isMobile]);

  return position;
};
