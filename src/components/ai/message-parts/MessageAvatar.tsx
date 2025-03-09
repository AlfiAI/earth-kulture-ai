
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface MessageAvatarProps {
  sender: 'user' | 'ai';
}

const MessageAvatar = ({ sender }: MessageAvatarProps) => {
  // The Waly AI avatar image path
  const walyAvatarPath = "/lovable-uploads/db6e9d05-9d19-408f-ac05-996d4d8006fb.png";
  
  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      {sender === 'ai' ? (
        <Avatar className="h-12 w-12 border-2 border-primary/20 bg-primary/10 shadow-sm">
          <AvatarImage 
            src={walyAvatarPath} 
            alt="Waly" 
            className="p-1"
          />
          <AvatarFallback className="bg-gradient-to-br from-primary to-sky-500 text-white">
            <img 
              src={walyAvatarPath} 
              alt="Waly" 
              className="h-full w-full p-1 object-contain"
            />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="h-12 w-12 border-2 border-primary/20 bg-primary/10 shadow-sm">
          <AvatarFallback className="bg-gradient-to-br from-sky-500 to-primary text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};

export default MessageAvatar;
