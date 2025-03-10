
import { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
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
}

const WalyChatButton = ({ onClick, position, onStarterClick, contextAwareStarters }: WalyChatButtonProps) => {
  const [showStarters, setShowStarters] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Basic visibility enforcement
  useEffect(() => {
    const enforceVisibility = () => {
      if (buttonRef.current) {
        buttonRef.current.style.visibility = 'visible';
        buttonRef.current.style.display = 'block';
        buttonRef.current.style.opacity = '1';
        buttonRef.current.style.zIndex = '9999999';
      }
    };
    
    enforceVisibility();
    const interval = setInterval(enforceVisibility, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Conversation starter questions
  const starters = contextAwareStarters || [
    "How can I improve my ESG score?",
    "Explain carbon footprint tracking",
    "What ESG metrics should I monitor?",
    "How to start sustainability reporting?"
  ];
  
  const handleMouseEnter = () => {
    setShowStarters(true);
  };
  
  const handleMouseLeave = () => {
    setShowStarters(false);
  };
  
  const handleStarterClick = (text: string) => {
    if (onStarterClick) {
      onStarterClick(text);
    } else {
      onClick();
    }
  };
  
  return (
    <motion.div
      id="chat-button"
      ref={buttonRef}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="fixed z-[9999999]"
      style={{ 
        bottom: `${position.bottom}rem`, 
        right: `${position.right}rem`,
        visibility: 'visible',
        display: 'block',
        opacity: 1
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        onClick={onClick}
        className={cn(
          "relative flex items-center justify-center p-0 w-16 h-16 rounded-full shadow-xl",
          "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700",
          "hover:shadow-primary/20 hover:shadow-2xl transition-all duration-300",
          "border-4 border-primary"
        )}
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
