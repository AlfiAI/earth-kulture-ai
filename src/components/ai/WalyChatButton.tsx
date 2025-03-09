
import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile';
import { useOverlapDetection } from '@/hooks/use-overlap-detection';
import ChatButtonAvatar from './chat-button/ChatButtonAvatar';
import AnimatedSparkle from './chat-button/AnimatedSparkle';
import ConversationStarterDropdown from './chat-button/ConversationStarterDropdown';

interface WalyChatButtonProps {
  onClick: () => void;
  position: { bottom: number; right: number };
  onStarterClick?: (text: string) => void;
  contextAwareStarters?: string[];
}

const WalyChatButton = ({ 
  onClick, 
  position, 
  onStarterClick,
  contextAwareStarters
}: WalyChatButtonProps) => {
  const walyAvatarPath = "/lovable-uploads/b4c78efa-4485-4d1a-8fa8-7b5337a8bd09.png";
  const [showStarters, setShowStarters] = useState(false);
  const isMobile = useIsMobile();
  const isOverlapping = useOverlapDetection('chat-button');
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // For direct DOM manipulation (index page fix)
  useEffect(() => {
    // First render check
    if (buttonRef.current) {
      buttonRef.current.style.visibility = 'visible';
      buttonRef.current.style.opacity = '1';
      buttonRef.current.style.display = 'block';
    }
    
    // Set a timeout to handle possible race conditions
    const timeoutId = setTimeout(() => {
      const button = document.getElementById('chat-button');
      if (button) {
        button.style.visibility = 'visible';
        button.style.opacity = '1';
        button.style.display = 'block';
        button.style.zIndex = '999999';
        console.log("Fixed chat button visibility via setTimeout");
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  // Conversation starter questions, use context-aware ones if provided
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
  
  // Convert rem values to px for positioning
  const bottomPx = position.bottom * 16; 
  const rightPx = position.right * 16;
  
  return (
    <motion.div
      id="chat-button"
      ref={buttonRef}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
      className={cn(
        "fixed z-[999999]", 
        isOverlapping && "opacity-80 hover:opacity-100"
      )}
      style={{ 
        bottom: `${bottomPx}px`, 
        right: `${rightPx}px`,
        visibility: 'visible',
        opacity: 1,
        display: 'block',
        zIndex: 999999
      }}
      whileHover={{ scale: 1.05, rotate: 3 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        onClick={onClick}
        className={cn(
          "relative flex items-center justify-center p-0 w-16 h-16 rounded-full shadow-xl",
          "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700",
          "hover:shadow-primary/20 hover:shadow-2xl transition-all duration-300",
          "border-4 border-primary" // Enhanced border for visibility
        )}
        aria-label="Chat with Waly AI"
      >
        <div className="w-12 h-12 overflow-hidden rounded-full">
          <ChatButtonAvatar avatarPath={walyAvatarPath} />
        </div>
        <AnimatedSparkle />
      </Button>
      
      {/* Conversation starters dropdown */}
      {showStarters && (
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
