
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useUserAvatar } from "@/hooks/use-user-avatar";

interface MessageAvatarProps {
  sender: 'user' | 'ai';
}

const MessageAvatar = ({ sender }: MessageAvatarProps) => {
  // Use the newly uploaded robot avatar image for AI
  const walyAvatarPath = "/lovable-uploads/fc07f487-a214-40b3-9914-8b4068465a8a.png";
  
  // Get user's avatar if available
  const { avatarUrl, initials } = useUserAvatar();
  
  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      {sender === 'ai' ? (
        <Avatar className="h-12 w-12 border-2 border-primary/20 bg-white shadow-sm">
          <AvatarImage 
            src={walyAvatarPath}
            alt="Waly AI" 
            className="p-1.5" // Added small padding
          />
          <AvatarFallback className="bg-white">
            <img 
              src={walyAvatarPath} 
              alt="Waly AI" 
              className="h-full w-full object-contain p-1.5" // Added small padding
            />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="h-12 w-12 border-2 border-primary/20 bg-primary/10 shadow-sm">
          <AvatarImage src={avatarUrl} alt="User" className="p-1.5" />
          <AvatarFallback className="bg-gradient-to-br from-sky-500 to-primary text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};

export default MessageAvatar;
