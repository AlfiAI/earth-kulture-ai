
import { useState, useEffect } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';

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
  // Use the same avatar path as in MessageAvatar for consistency
  const walyAvatarPath = "/lovable-uploads/fc07f487-a214-40b3-9914-8b4068465a8a.png";
  const [showStarters, setShowStarters] = useState(false);
  const [isOverlapping, setIsOverlapping] = useState(false);
  const isMobile = useIsMobile();
  
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
  
  // Check for overlapping elements
  useEffect(() => {
    const checkOverlap = () => {
      const chatButton = document.getElementById('chat-button');
      if (!chatButton) return;
      
      const buttonRect = chatButton.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;
      
      // Check all clickable elements (buttons, links, etc.)
      const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, select, textarea');
      
      let isOverlapping = false;
      interactiveElements.forEach(element => {
        if (element === chatButton) return; // Skip self
        
        const elementRect = element.getBoundingClientRect();
        
        // Check if the elements overlap
        if (
          buttonRect.right > elementRect.left &&
          buttonRect.left < elementRect.right &&
          buttonRect.bottom > elementRect.top &&
          buttonRect.top < elementRect.bottom
        ) {
          isOverlapping = true;
        }
      });
      
      setIsOverlapping(isOverlapping);
    };
    
    // Check overlap initially and on window resize
    checkOverlap();
    window.addEventListener('resize', checkOverlap);
    window.addEventListener('scroll', checkOverlap);
    
    // Recheck periodically for dynamic content changes
    const intervalId = setInterval(checkOverlap, 1000);
    
    return () => {
      window.removeEventListener('resize', checkOverlap);
      window.removeEventListener('scroll', checkOverlap);
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <motion.div
      id="chat-button"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn(
        "fixed z-50",
        isOverlapping && "opacity-80 hover:opacity-100"
      )}
      style={{ 
        bottom: `${position.bottom}rem`, 
        right: `${position.right}rem`,
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
          "bg-white hover:bg-gray-50",
          "hover:shadow-primary/20 hover:shadow-2xl transition-all duration-300"
        )}
      >
        <Avatar className="w-14 h-14 border-2 border-primary/10 overflow-visible">
          <AvatarImage 
            src={walyAvatarPath} 
            alt="Waly Bot"
            className="object-contain p-2.5" // Increased padding
          />
          <AvatarFallback className="bg-white">
            <img 
              src={walyAvatarPath} 
              alt="Waly Bot" 
              className="h-full w-full object-contain p-2.5" // Increased padding
            />
          </AvatarFallback>
        </Avatar>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="h-4 w-4 text-yellow-300" />
        </motion.div>
      </Button>
      
      {/* Conversation starters dropdown */}
      {showStarters && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "absolute mb-2",
            isMobile ? "bottom-[4.5rem] right-0" : "bottom-[4.5rem] right-0"
          )}
        >
          <Card className="p-1.5 bg-white/95 backdrop-blur-sm border border-primary/10 shadow-lg rounded-xl w-[280px]">
            <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              Quick prompts:
            </div>
            <div className="space-y-1">
              {starters.map((starter, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs rounded-lg p-2 h-auto"
                  onClick={() => handleStarterClick(starter)}
                >
                  <MessageSquare className="h-3 w-3 mr-2 text-primary" />
                  <span className="truncate">{starter}</span>
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WalyChatButton;
