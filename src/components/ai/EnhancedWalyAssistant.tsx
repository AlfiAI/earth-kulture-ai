
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCirclePlus } from 'lucide-react';
import EnhancedChatPanel from './EnhancedChatPanel';
import { cn } from "@/lib/utils";

interface EnhancedWalyAssistantProps {
  initialOpen?: boolean;
}

const EnhancedWalyAssistant = ({ initialOpen = false }: EnhancedWalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [position, setPosition] = useState({ bottom: 2, right: 2 });
  const chatPanelRef = useRef<HTMLDivElement>(null);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Handle scrolling by adjusting the assistant's position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollBottom = scrollY + viewportHeight;
      const threshold = documentHeight - 200;
      
      // Adjust position based on scroll
      if (scrollBottom >= threshold) {
        // Near bottom of page, move up a bit
        setPosition({ bottom: 20, right: 4 });
      } else {
        // Regular position
        setPosition({ bottom: 4, right: 4 });
      }
    };

    // Handle window resize
    const handleResize = () => {
      // Adjust position if needed based on window size
      if (window.innerWidth < 640) { // Mobile view
        setPosition({ bottom: 2, right: 1 });
      } else {
        setPosition({ bottom: 4, right: 4 });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial position check
    handleResize();
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Detect clicks outside the chat panel to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatPanelRef.current && 
        !chatPanelRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('button')
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          className="fixed rounded-full w-16 h-16 shadow-xl bg-gradient-to-r from-primary to-sky-500 text-white hover:bg-primary/90 flex items-center justify-center z-50 transition-all duration-300 animate-pulse-gentle"
          style={{ bottom: `${position.bottom}rem`, right: `${position.right}rem` }}
        >
          <div className="relative">
            <MessageCirclePlus className="h-7 w-7" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-float" />
          </div>
        </Button>
      )}
      
      <EnhancedChatPanel 
        ref={chatPanelRef}
        isOpen={isOpen}
        onClose={toggleOpen}
        position={position}
      />
    </>
  );
};

export default EnhancedWalyAssistant;
