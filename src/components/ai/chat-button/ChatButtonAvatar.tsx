
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ChatButtonAvatarProps {
  avatarPath: string;
}

const ChatButtonAvatar = ({ avatarPath }: ChatButtonAvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Reset error state when avatar path changes and preload image
  useEffect(() => {
    setImageError(false);
    setIsLoaded(false);
    
    console.log("Loading avatar image:", avatarPath);
    
    // Preload the image and handle fallback cases
    const img = new Image();
    img.src = avatarPath;
    
    // Set successful load handler
    img.onload = () => {
      console.log("Avatar image successfully preloaded:", avatarPath);
      setIsLoaded(true);
    };
    
    // Handle loading errors
    img.onerror = () => {
      console.error("Failed to preload avatar image:", avatarPath);
      setImageError(true);
      setIsLoaded(true); // Still mark as loaded so we show fallback
    };
    
    // Force complete load state after short timeout regardless of image status
    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true);
      if (!img.complete || img.naturalWidth === 0) {
        setImageError(true);
      }
    }, 300);
    
    return () => clearTimeout(fallbackTimer);
  }, [avatarPath]);
  
  const handleImageError = () => {
    console.error("Failed to load avatar image in component:", avatarPath);
    setImageError(true);
  };
  
  // Show fallback immediately if there's an error
  if (imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-cyan-500">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
    );
  }
  
  // Show loading state or image
  return (
    <div className={cn(
      "w-full h-full flex items-center justify-center",
      !isLoaded && "animate-pulse bg-gray-200 dark:bg-gray-700"
    )}>
      {isLoaded ? (
        <img 
          src={avatarPath} 
          alt="Waly AI" 
          className="w-full h-full object-cover p-2"
          onError={handleImageError}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse"></div>
      )}
    </div>
  );
};

export default ChatButtonAvatar;
