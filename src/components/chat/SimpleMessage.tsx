
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useUserAvatar } from "@/hooks/use-user-avatar";
import { User, Bot, Sparkles } from "lucide-react";

export interface MessageProps {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const SimpleMessage = ({ content, sender }: MessageProps) => {
  const { avatarUrl, initials } = useUserAvatar();
  const walyAvatarPath = "/lovable-uploads/e48e0f44-7e54-4337-b0ea-8893795682ba.png";
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 500,
        duration: 0.4
      }
    }
  };
  
  const bubbleVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        delay: 0.1
      }
    }
  };
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex gap-3 items-start p-2",
        sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {sender === 'ai' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.05, rotate: 2 }}
        >
          <Avatar className="h-10 w-10 border-2 border-emerald-100 shadow-md">
            <AvatarImage src={walyAvatarPath} alt="Waly" className="p-1" />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
      
      <motion.div 
        variants={bubbleVariants}
        className={cn(
          "rounded-2xl p-4 max-w-[75%] shadow-md",
          sender === 'user' 
            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white" 
            : "bg-white/95 backdrop-blur-sm border border-emerald-100/50"
        )}
      >
        <div className="relative">
          {sender === 'ai' && (
            <motion.div 
              className="absolute -top-1 -left-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
            </motion.div>
          )}
          <div className={cn("text-sm", sender === 'ai' ? "pr-2 pl-2" : "")}>
            {content}
          </div>
        </div>
      </motion.div>
      
      {sender === 'user' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.05, rotate: -2 }}
        >
          <Avatar className="h-10 w-10 border-2 border-emerald-200 shadow-md">
            <AvatarImage src={avatarUrl} alt="User" />
            <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SimpleMessage;
