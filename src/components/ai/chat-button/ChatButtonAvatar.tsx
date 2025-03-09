
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
  
  // Render a fallback regardless of image loading state to ensure something always appears
  return (
    <div className="w-full h-full flex items-center justify-center">
      {!imageError ? (
        <img 
          src={avatarPath} 
          alt="Waly AI" 
          className="w-full h-full object-contain p-2.5"
          onError={handleImageError}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-cyan-500">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      )}
      
      {/* Always show fallback if not loaded yet */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-500/80 to-cyan-500/80">
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default ChatButtonAvatar;
