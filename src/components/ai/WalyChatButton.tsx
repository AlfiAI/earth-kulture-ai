
import { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ChatButtonAvatar from './chat-button/ChatButtonAvatar';
import AnimatedSparkle from './chat-button/AnimatedSparkle';
import ConversationStarterDropdown from './chat-button/ConversationStarterDropdown';
import { useIsMobile } from "@/hooks/use-mobile";

interface WalyChatButtonProps {
  onClick: () => void;
  position: { bottom: number; right: number };
  onStarterClick?: (text: string) => void;
  contextAwareStarters?: string[];
  showStarters: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const WalyChatButton = ({ 
  onClick, 
  position, 
  onStarterClick, 
  contextAwareStarters,
  showStarters,
  onMouseEnter,
  onMouseLeave
}: WalyChatButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Force visibility of chat button
  useEffect(() => {
    console.log('WalyChatButton mounted, ensuring visibility');
    
    const forceVisible = () => {
      if (buttonRef.current) {
        console.log('Forcing button visibility');
        buttonRef.current.style.cssText = `
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
          z-index: 99999999 !important;
          position: fixed !important;
          bottom: ${isMobile ? '5rem' : `${position.bottom}rem`} !important;
          right: ${isMobile ? '1rem' : `${position.right}rem`} !important;
          pointer-events: auto !important;
          width: auto !important;
          height: auto !important;
        `;
      }
    };
    
    // Run immediately and set interval
    forceVisible();
    const interval = setInterval(forceVisible, 200);
    
    return () => clearInterval(interval);
  }, [position, isMobile]);
  
  // Conversation starter questions
  const starters = contextAwareStarters || [
    "How can I improve my ESG score?",
    "Explain carbon footprint tracking",
    "What ESG metrics should I monitor?",
    "How to start sustainability reporting?"
  ];
  
  const handleStarterClick = (text: string) => {
    if (onStarterClick) {
      onStarterClick(text);
    } else {
      onClick();
    }
  };
  
  console.log('Rendering WalyChatButton, showStarters:', showStarters);
  
  return (
    <motion.div
      id="chat-button"
      ref={buttonRef}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="fixed"
      style={{ 
        position: 'fixed',
        bottom: isMobile ? '5rem' : `${position.bottom}rem`, 
        right: isMobile ? '1rem' : `${position.right}rem`,
        zIndex: 99999999,
        visibility: 'visible',
        display: 'block',
        opacity: 1,
        pointerEvents: 'auto'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Button
        onClick={onClick}
        className="relative flex items-center justify-center p-0 w-12 h-12 md:w-16 md:h-16 rounded-full shadow-xl
                 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700
                 hover:shadow-primary/20 hover:shadow-2xl transition-all duration-300
                 border-4 border-primary"
        aria-label="Chat with Waly AI"
      >
        <div className="w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full">
          <ChatButtonAvatar avatarPath="/lovable-uploads/e48e0f44-7e54-4337-b0ea-8893795682ba.png" />
        </div>
        <AnimatedSparkle />
      </Button>
      
      {showStarters && !isMobile && (
        <ConversationStarterDropdown 
          starters={starters}
          onStarterClick={handleStarterClick}
          isMobile={isMobile}
        />
      )}
    </motion.div>
  );
};

export default WalyChatButton;
