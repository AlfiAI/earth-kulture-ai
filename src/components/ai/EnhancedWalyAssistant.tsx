
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import EnhancedChatPanel from './EnhancedChatPanel';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EnhancedWalyAssistantProps {
  initialOpen?: boolean;
}

const EnhancedWalyAssistant = ({ initialOpen = false }: EnhancedWalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [position, setPosition] = useState({ bottom: 2, right: 2 });
  const chatPanelRef = useRef<HTMLDivElement>(null);
  
  // Use the same avatar path as in MessageAvatar for consistency
  const walyAvatarPath = "/lovable-uploads/fc07f487-a214-40b3-9914-8b4068465a8a.png";
  
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
          className="fixed rounded-full shadow-xl flex items-center justify-center z-50 p-0 hover:scale-105 transition-all duration-300 group bg-white"
          style={{ 
            bottom: `${position.bottom}rem`, 
            right: `${position.right}rem`,
            width: "64px",
            height: "64px"
          }}
        >
          <Avatar className="w-full h-full border-2 border-primary/10">
            <AvatarImage 
              src={walyAvatarPath} 
              alt="Waly" 
              className="p-1.5" // Added small padding
            />
            <AvatarFallback className="bg-white">
              <img 
                src={walyAvatarPath} 
                alt="Waly" 
                className="h-full w-full object-contain p-1.5" // Added small padding
              />
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-sky-500/10 animate-pulse-gentle group-hover:opacity-0 transition-opacity"></div>
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
