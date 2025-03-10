
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ChatButtonAvatarProps {
  avatarPath: string;
}

const ChatButtonAvatar = ({ avatarPath }: ChatButtonAvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const defaultAvatarPath = "/lovable-uploads/e48e0f44-7e54-4337-b0ea-8893795682ba.png";
  
  // Reset error state when avatar path changes and preload image
  useEffect(() => {
    setImageError(false);
    setIsLoaded(false);
    
    // Explicitly set the default path if none provided
    const path = avatarPath || defaultAvatarPath;
    console.log("ChatButtonAvatar: Loading image from path:", path);
    
    // Preload the image and handle fallback cases
    const img = new Image();
    img.src = path;
    
    // Set successful load handler
    img.onload = () => {
      console.log("ChatButtonAvatar: Image successfully loaded:", path);
      setIsLoaded(true);
    };
    
    // Handle loading errors
    img.onerror = () => {
      console.error("ChatButtonAvatar: Failed to load image:", path);
      setImageError(true);
      setIsLoaded(true); // Still mark as loaded so we show fallback
      
      // Try loading the default image if this was a custom one
      if (path !== defaultAvatarPath) {
        const defaultImg = new Image();
        defaultImg.src = defaultAvatarPath;
      }
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
    console.error("ChatButtonAvatar: Runtime error loading image:", avatarPath);
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
          src={avatarPath || defaultAvatarPath} 
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
