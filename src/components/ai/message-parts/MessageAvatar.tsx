
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface MessageAvatarProps {
  sender: 'user' | 'ai';
}

const MessageAvatar = ({ sender }: MessageAvatarProps) => {
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
            src="/lovable-uploads/db6e9d05-9d19-408f-ac05-996d4d8006fb.png" 
            alt="Waly" 
            className="p-1"
          />
          <AvatarFallback className="bg-gradient-to-br from-primary to-sky-500 text-white">
            <AvatarImage 
              src="/lovable-uploads/db6e9d05-9d19-408f-ac05-996d4d8006fb.png" 
              alt="Waly" 
              className="p-1"
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
