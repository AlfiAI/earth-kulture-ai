
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
    
    // Preload the image
    const img = new Image();
    img.src = avatarPath;
    img.onload = () => {
      console.log("Avatar image successfully preloaded:", avatarPath);
      setIsLoaded(true);
    };
    img.onerror = () => {
      console.error("Failed to preload avatar image:", avatarPath);
      setImageError(true);
      setIsLoaded(true); // Still mark as loaded so we show fallback
    };
    
    // Set a fallback timeout to ensure we show something even if loading stalls
    const fallbackTimer = setTimeout(() => {
      if (!isLoaded) {
        console.log("Using fallback timeout to display avatar");
        setIsLoaded(true);
        // If we still haven't loaded, assume there was an error
        if (!img.complete) {
          setImageError(true);
        }
      }
    }, 300); // Shorter timeout to ensure faster display
    
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
          className="w-full h-full object-contain p-2.5"
          onError={handleImageError}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse"></div>
      )}
    </div>
  );
};

export default ChatButtonAvatar;
