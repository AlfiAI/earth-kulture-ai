
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useUserAvatar } from "@/hooks/use-user-avatar";
import { User } from "lucide-react";

export interface MessageProps {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const SimpleMessage = ({ content, sender }: MessageProps) => {
  const { avatarUrl, initials } = useUserAvatar();
  const walyAvatarPath = "/lovable-uploads/e48e0f44-7e54-4337-b0ea-8893795682ba.png";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 items-start p-2",
        sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {sender === 'ai' && (
        <Avatar className="h-10 w-10 border-2 border-emerald-100 shadow-sm">
          <AvatarImage src={walyAvatarPath} alt="Waly" className="p-1" />
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "rounded-2xl p-4 max-w-[75%] shadow-sm",
        sender === 'user' 
          ? "bg-gradient-to-br from-primary to-sky-500 text-white" 
          : "bg-white border border-gray-100"
      )}>
        {content}
      </div>
      
      {sender === 'user' && (
        <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm">
          <AvatarImage src={avatarUrl} alt="User" />
          <AvatarFallback className="bg-gradient-to-br from-sky-500 to-primary text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};

export default SimpleMessage;
