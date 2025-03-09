
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
  // Updated to use the provided image
  const walyAvatarPath = "/lovable-uploads/b4c78efa-4485-4d1a-8fa8-7b5337a8bd09.png";
  const [showStarters, setShowStarters] = useState(false);
  const isMobile = useIsMobile();
  const isOverlapping = useOverlapDetection('chat-button');
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Ensure visibility on mount and after route changes
  useEffect(() => {
    console.log("WalyChatButton rendering with position:", position);
    
    // Force button to be visible immediately
    if (buttonRef.current) {
      buttonRef.current.style.visibility = 'visible';
      buttonRef.current.style.opacity = '1';
      buttonRef.current.style.display = 'block';
      console.log("Set visibility directly on button element");
    }
    
    // Force visibility of chat button by ID as well
    const forceChatButtonVisibility = () => {
      const chatButton = document.getElementById('chat-button');
      if (chatButton) {
        chatButton.style.visibility = 'visible';
        chatButton.style.opacity = '1';
        chatButton.style.display = 'block';
        console.log("Forced chat button visibility");
      }
    };
    
    // Call immediately and after short delays to ensure visibility
    forceChatButtonVisibility();
    const timeouts = [100, 300, 500, 1000].map(delay => 
      setTimeout(forceChatButtonVisibility, delay)
    );
    
    return () => timeouts.forEach(clearTimeout);
  }, [position]);
  
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
  
  // Convert rem values to px for consistent positioning
  const bottomPx = position.bottom * 16; // Convert rem to px (1rem = 16px)
  const rightPx = position.right * 16; // Convert rem to px (1rem = 16px)
  
  return (
    <motion.div
      id="chat-button"
      ref={buttonRef}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
      className={cn(
        "fixed z-[999999]", // Ensure very high z-index
        isOverlapping && "opacity-80 hover:opacity-100",
        "visible" // Always visible
      )}
      style={{ 
        bottom: `${bottomPx}px`, 
        right: `${rightPx}px`,
        transition: 'bottom 0.3s ease, right 0.3s ease',
        visibility: 'visible', // Explicitly set visibility
        opacity: 1, // Explicitly set opacity
        display: 'block' // Explicitly set display
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
          "border-2 border-primary/40" // Enhanced border for visibility
        )}
        aria-label="Chat with Waly AI"
      >
        <div className="w-14 h-14 overflow-hidden rounded-full">
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
