
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface ChatButtonAvatarProps {
  avatarPath: string;
}

const ChatButtonAvatar = ({ avatarPath }: ChatButtonAvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Reset error state when avatar path changes
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
    };
  }, [avatarPath]);
  
  const handleImageError = () => {
    console.error("Failed to load avatar image in component:", avatarPath);
    setImageError(true);
  };
  
  const handleImageLoad = () => {
    console.log("Avatar image loaded successfully in component");
    setIsLoaded(true);
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      {!imageError ? (
        <img 
          src={avatarPath} 
          alt="Waly AI" 
          className="w-full h-full object-contain p-2.5"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ 
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-cyan-500">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      )}
      
      {/* Show loading state if neither loaded nor error */}
      {!isLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-500/80 to-cyan-500/80">
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default ChatButtonAvatar;
