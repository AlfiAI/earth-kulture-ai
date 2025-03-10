
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
  
  // Force visibility on mount and periodically with aggressive approach
  useEffect(() => {
    console.log("WalyChatButton: Component mounted");
    
    // Function to ensure button visibility with !important styles
    const ensureButtonVisibility = () => {
      if (buttonRef.current) {
        buttonRef.current.setAttribute('style', `
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
          z-index: 9999999 !important;
          position: fixed !important;
          bottom: ${position.bottom}rem !important;
          right: ${position.right}rem !important;
          pointer-events: auto !important;
          transform: none !important;
        `);
      }
      
      // Also apply directly to DOM element by ID
      const button = document.getElementById('chat-button');
      if (button) {
        button.setAttribute('style', `
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
          z-index: 9999999 !important;
          position: fixed !important;
          bottom: ${position.bottom}rem !important;
          right: ${position.right}rem !important;
          pointer-events: auto !important;
          transform: none !important;
        `);
      }
    };
    
    // Call immediately
    ensureButtonVisibility();
    
    // Call multiple times with delays to handle potential race conditions
    [50, 100, 200, 300, 500, 1000, 2000, 5000].forEach(delay => {
      setTimeout(ensureButtonVisibility, delay);
    });
    
    // Periodic check
    const interval = setInterval(ensureButtonVisibility, 500);
    
    // Use MutationObserver to detect DOM changes
    const observer = new MutationObserver(() => {
      ensureButtonVisibility();
    });
    
    // Start observing the document body for all changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true
    });
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
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
  
  // Convert rem values to px for positioning
  const bottomPx = position.bottom * 16; 
  const rightPx = position.right * 16;
  
  return (
    <motion.div
      id="chat-button"
      ref={buttonRef}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className={cn(
        "fixed z-[9999999]", 
        isOverlapping && "opacity-80 hover:opacity-100"
      )}
      style={{ 
        bottom: `${bottomPx}px`, 
        right: `${rightPx}px`,
        visibility: 'visible',
        opacity: 1,
        display: 'block',
        zIndex: 9999999,
        position: 'fixed'
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
