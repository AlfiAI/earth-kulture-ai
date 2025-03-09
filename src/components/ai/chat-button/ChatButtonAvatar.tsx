
import { useState, useEffect } from 'react';
import { Sparkles, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatButtonAvatarProps {
  avatarPath: string;
}

const ChatButtonAvatar = ({ avatarPath }: ChatButtonAvatarProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Verify the avatar image can be loaded
  useEffect(() => {
    // Reset states when avatarPath changes
    setImageLoaded(false);
    setImageError(false);
    
    console.log("Attempting to load Waly avatar from:", avatarPath);
    
    const img = new Image();
    img.src = avatarPath;
    
    img.onload = () => {
      console.log("Waly avatar image loaded successfully");
      setImageLoaded(true);
    };
    
    img.onerror = (e) => {
      console.error("Failed to load Waly avatar image:", e);
      setImageError(true);
    };
    
    // Add a fallback timeout in case the image load event doesn't fire
    const timeout = setTimeout(() => {
      if (!imageLoaded && !imageError) {
        console.warn("Waly avatar image load timed out - using fallback");
        setImageError(true);
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [avatarPath, imageLoaded]);

  return (
    <Avatar className="w-14 h-14 border-2 border-primary/10 overflow-visible">
      {(!imageError) && (
        <AvatarImage 
          src={avatarPath} 
          alt="Waly Bot"
          className="object-cover p-0" 
          onError={() => {
            console.error("AvatarImage failed to load Waly avatar");
            setImageError(true);
          }}
        />
      )}
      
      <AvatarFallback className="bg-white dark:bg-gray-800">
        <div className="h-full w-full flex items-center justify-center text-primary">
          {imageError ? (
            <User className="h-8 w-8" />
          ) : (
            <Sparkles className="h-8 w-8" />
          )}
        </div>
      </AvatarFallback>
    </Avatar>
  );
};

export default ChatButtonAvatar;
