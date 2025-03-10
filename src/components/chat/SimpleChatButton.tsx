
import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface SimpleChatButtonProps {
  onClick: () => void;
  position?: { bottom: number; right: number };
}

const SimpleChatButton = ({ onClick, position = { bottom: 2, right: 2 } }: SimpleChatButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Force visibility using direct DOM manipulation
  useEffect(() => {
    console.log('SimpleChatButton mounted');
    
    const forceVisible = () => {
      if (buttonRef.current) {
        console.log('Forcing button visibility');
        buttonRef.current.style.cssText = `
          position: fixed !important;
          bottom: ${position.bottom}rem !important;
          right: ${position.right}rem !important;
          z-index: 9999999 !important;
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          width: auto !important;
          height: auto !important;
        `;
      }
    };
    
    // Run immediately and periodically
    forceVisible();
    const interval = setInterval(forceVisible, 300);
    
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
        zIndex: 9999999,
        visibility: 'visible',
        display: 'block'
      }}
    >
      <Button
        onClick={onClick}
        className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white flex items-center justify-center"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default SimpleChatButton;
