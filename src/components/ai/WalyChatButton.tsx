
import { useState, useEffect } from 'react';
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
  // Use a public URL path that is definitely accessible
  const walyAvatarPath = "/lovable-uploads/fc07f487-a214-40b3-9914-8b4068465a8a.png";
  const [showStarters, setShowStarters] = useState(false);
  const isMobile = useIsMobile();
  const isOverlapping = useOverlapDetection('chat-button');
  const [isVisible, setIsVisible] = useState(false);
  
  // Debug logging and ensure the component is visible after a short delay
  useEffect(() => {
    console.log("WalyChatButton rendering with position:", position);
    console.log("Avatar path:", walyAvatarPath);
    
    // Force browser to load the image into cache
    const preloadImage = new Image();
    preloadImage.src = walyAvatarPath;
    
    // Add error handling for image loading
    preloadImage.onerror = () => {
      console.error("Failed to load Waly avatar image:", walyAvatarPath);
    };
    
    preloadImage.onload = () => {
      console.log("Successfully preloaded Waly avatar image");
    };
    
    // Ensure the button becomes visible after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [position, walyAvatarPath]);
  
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
  
  if (!isVisible) {
    return null; // Don't render until we're ready to show
  }
  
  return (
    <motion.div
      id="chat-button"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn(
        "fixed z-[9999]", // Ensure very high z-index
        isOverlapping && "opacity-80 hover:opacity-100"
      )}
      style={{ 
        bottom: `${bottomPx}px`, 
        right: `${rightPx}px`,
        transition: 'bottom 0.3s ease, right 0.3s ease'
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
          "hover:shadow-primary/20 hover:shadow-2xl transition-all duration-300"
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
