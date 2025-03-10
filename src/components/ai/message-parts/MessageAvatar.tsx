
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useUserAvatar } from "@/hooks/use-user-avatar";
import { useEffect, useState } from 'react';

interface MessageAvatarProps {
  sender: 'user' | 'ai';
}

const MessageAvatar = ({ sender }: MessageAvatarProps) => {
  // Use the updated Waly avatar image
  const walyAvatarPath = "/lovable-uploads/fa2419be-7196-4ace-9f1c-60dec598d88b.png";
  
  // State to track image loading
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Get user's avatar if available
  const { avatarUrl, initials } = useUserAvatar();
  
  // Preload AI avatar
  useEffect(() => {
    if (sender === 'ai') {
      console.log("MessageAvatar: Preloading AI avatar");
      const img = new Image();
      img.src = walyAvatarPath;
      
      img.onload = () => {
        console.log("MessageAvatar: AI avatar loaded successfully");
        setImageLoaded(true);
      };
      
      img.onerror = () => {
        console.error("MessageAvatar: Failed to load AI avatar");
        setImageError(true);
      };
      
      // Force complete load state after short timeout
      const fallbackTimer = setTimeout(() => {
        if (!imageLoaded) {
          console.log("MessageAvatar: Using fallback load mechanism");
          setImageLoaded(true);
        }
      }, 500);
      
      return () => clearTimeout(fallbackTimer);
    }
  }, [sender, imageLoaded]);
  
  const handleImageError = () => {
    console.error("MessageAvatar: Runtime error loading AI avatar");
    setImageError(true);
  };
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.05, rotate: 2 }}
    >
      {sender === 'ai' ? (
        <Avatar className="h-12 w-12 border-2 border-emerald-100 bg-white shadow-md">
          {imageError ? (
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
              <div className="h-full w-full flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage 
                src={walyAvatarPath}
                alt="Waly AI" 
                className="p-1"
                onError={handleImageError}
              />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
                <div className="h-full w-full flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
              </AvatarFallback>
            </>
          )}
        </Avatar>
      ) : (
        <Avatar className="h-12 w-12 border-2 border-primary/20 bg-primary/10 shadow-md">
          <AvatarImage src={avatarUrl} alt="User" />
          <AvatarFallback className="bg-gradient-to-br from-sky-500 to-primary text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};

export default MessageAvatar;
