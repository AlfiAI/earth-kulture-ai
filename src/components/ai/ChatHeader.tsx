
import { X, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface ChatHeaderProps {
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

const ChatHeader = ({ onClose, title, subtitle }: ChatHeaderProps) => {
  const isMobile = useIsMobile();
  const displayTitle = title || (isMobile ? "Waly" : "Waly Assistant");

  return (
    <motion.div 
      className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-4 flex items-center justify-between rounded-t-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Avatar className="h-12 w-12 bg-white/20 border-2 border-white/30 ring-2 ring-white/10 shadow-lg">
            <AvatarImage src="/lovable-uploads/576b2f20-ecd7-4793-bc03-a40c9349e2a1.png" alt="Waly" className="p-1" />
            <AvatarFallback className="bg-gradient-to-br from-white/90 to-white/70 text-primary">
              <Sparkles className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="flex flex-col">
          <motion.h2 
            className="font-medium text-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {displayTitle}
          </motion.h2>
          {subtitle && (
            <motion.p 
              className="text-xs text-white/80"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.3 }}
        >
          <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/20 shadow-sm animate-pulse-gentle">Beta</Badge>
        </motion.div>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.1, rotate: 90 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-white hover:bg-white/10 rounded-full transition-all duration-300"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ChatHeader;
