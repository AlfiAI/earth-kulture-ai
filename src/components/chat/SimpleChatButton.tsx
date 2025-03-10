
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
  
  // Animation variants for the button
  const buttonVariants = {
    initial: { 
      scale: 0.8, 
      opacity: 0,
      rotate: -10
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 15, 
        duration: 0.6 
      }
    },
    hover: { 
      scale: 1.05,
      rotate: 5,
      boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.3)"
    },
    tap: { 
      scale: 0.95,
      rotate: 0
    }
  };
  
  // Ripple animation for the button background - FIXED the repeatType to use literal "loop"
  const rippleVariants = {
    initial: { 
      scale: 1,
      opacity: 0
    },
    animate: { 
      scale: [1, 1.05, 1.1, 1.15, 1.1, 1],
      opacity: [0, 0.1, 0.2, 0.1, 0],
      transition: { 
        repeat: Infinity,
        repeatType: "loop",  // Changed from string to literal "loop"
        duration: 3,
        ease: "easeInOut" 
      }
    }
  };
  
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
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-500/20"
            variants={rippleVariants}
            initial="initial"
            animate="animate"
          />
          
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
              animate={{ 
                scale: [1, 1.2, 1],  
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </motion.div>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SimpleChatButton;
