
import { useState, useEffect, useRef } from 'react';
import EnhancedChatToggleButton from './EnhancedChatToggleButton';
import EnhancedChatPanel from './EnhancedChatPanel';

interface EnhancedWalyAssistantProps {
  initialOpen?: boolean;
}

const EnhancedWalyAssistant = ({ initialOpen = false }: EnhancedWalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [position, setPosition] = useState({ bottom: 4, right: 4 });
  const chatRef = useRef<HTMLDivElement>(null);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Focus the input field when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const inputElement = document.querySelector('.chat-input textarea');
        if (inputElement instanceof HTMLTextAreaElement) {
          inputElement.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // Handle scrolling and adjust position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Adjust position based on scroll
      if (scrollY + viewportHeight >= documentHeight - 100) {
        // Near bottom of page, move up a bit
        setPosition({ bottom: 16, right: 4 });
      } else {
        // Reset to default position
        setPosition({ bottom: 4, right: 4 });
      }
    };

    // Handle window resize
    const handleResize = () => {
      // Adjust position if needed based on window size
      if (window.innerWidth < 640) { // Mobile view
        setPosition({ bottom: 4, right: 2 });
      } else {
        setPosition({ bottom: 4, right: 4 });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial position check
    handleResize();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {!isOpen && (
        <EnhancedChatToggleButton 
          onClick={toggleOpen} 
          position={position}
        />
      )}
      <EnhancedChatPanel 
        isOpen={isOpen} 
        onClose={toggleOpen} 
        position={position}
        ref={chatRef}
      />
    </>
  );
};

export default EnhancedWalyAssistant;
