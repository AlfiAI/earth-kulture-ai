
import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 15, 
          duration: 0.4 
        }}
      >
        <Button
          onClick={onClick}
          className="group w-16 h-16 rounded-full shadow-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-emerald-500/20 text-white flex items-center justify-center border-4 border-white relative overflow-hidden"
          size="icon"
        >
          <MessageSquare className="h-8 w-8 z-10 transition-transform duration-500 ease-out group-hover:rotate-12" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
          <motion.div
            className="absolute -top-1 -right-1"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
          >
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
};

export default SimpleChatButton;
