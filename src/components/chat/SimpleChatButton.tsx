
import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface SimpleChatButtonProps {
  onClick: () => void;
  position?: { bottom: number; right: number };
}

const SimpleChatButton = ({ onClick, position = { bottom: 6, right: 2 } }: SimpleChatButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Enhanced visibility using direct DOM manipulation
  useEffect(() => {
    console.log('SimpleChatButton mounted - attempting to make visible');
    
    const forceVisible = () => {
      if (buttonRef.current) {
        console.log('Forcing button visibility with higher z-index and more aggressive styling');
        buttonRef.current.style.cssText = `
          position: fixed !important;
          bottom: ${position.bottom}rem !important;
          right: ${position.right}rem !important;
          z-index: 99999999 !important;
          visibility: visible !important;
          display: flex !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          width: auto !important;
          height: auto !important;
          transform: none !important;
          background: none !important;
          overflow: visible !important;
          transition: none !important;
        `;
        
        // Also ensure the button itself is visible
        const buttonElement = buttonRef.current.querySelector('button');
        if (buttonElement) {
          buttonElement.style.cssText = `
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
          `;
        }
      }
    };
    
    // Run immediately and more frequently
    forceVisible();
    const interval = setInterval(forceVisible, 100);
    
    // Add a fallback timeout to ensure it becomes visible
    setTimeout(() => {
      console.log('Final attempt to make chat button visible');
      forceVisible();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [position]);
  
  return (
    <div 
      ref={buttonRef}
      className="fixed"
      style={{
        position: 'fixed',
        bottom: `${position.bottom}rem`,
        right: `${position.right}rem`,
        zIndex: 99999999,
        visibility: 'visible',
        display: 'block'
      }}
    >
      <Button
        onClick={onClick}
        className="w-16 h-16 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center border-4 border-white"
        size="icon"
      >
        <MessageSquare className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default SimpleChatButton;
