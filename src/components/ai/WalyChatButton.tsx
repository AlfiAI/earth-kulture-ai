
import { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ChatButtonAvatar from './chat-button/ChatButtonAvatar';
import AnimatedSparkle from './chat-button/AnimatedSparkle';
import ConversationStarterDropdown from './chat-button/ConversationStarterDropdown';

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
  
  // Force visibility of chat button
  useEffect(() => {
    console.log('WalyChatButton mounted, ensuring visibility');
    if (buttonRef.current) {
      const forceVisible = () => {
        if (buttonRef.current) {
          buttonRef.current.style.cssText = `
            visibility: visible !important;
            display: block !important;
            opacity: 1 !important;
            z-index: 99999999 !important;
            position: fixed !important;
            bottom: ${position.bottom}rem !important;
            right: ${position.right}rem !important;
            pointer-events: auto !important;
          `;
        }
      };
      
      forceVisible();
      // Run periodically to ensure continuous visibility
      const interval = setInterval(forceVisible, 200);
      
      return () => clearInterval(interval);
    }
  }, [position]);
  
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
        bottom: `${position.bottom}rem`, 
        right: `${position.right}rem`,
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
        className="relative flex items-center justify-center p-0 w-16 h-16 rounded-full shadow-xl
                 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700
                 hover:shadow-primary/20 hover:shadow-2xl transition-all duration-300
                 border-4 border-primary"
        aria-label="Chat with Waly AI"
      >
        <div className="w-12 h-12 overflow-hidden rounded-full">
          <ChatButtonAvatar avatarPath="/lovable-uploads/b4c78efa-4485-4d1a-8fa8-7b5337a8bd09.png" />
        </div>
        <AnimatedSparkle />
      </Button>
      
      {showStarters && (
        <ConversationStarterDropdown 
          starters={starters}
          onStarterClick={handleStarterClick}
          isMobile={false}
        />
      )}
    </motion.div>
  );
};

export default WalyChatButton;
