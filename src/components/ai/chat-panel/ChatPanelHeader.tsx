
import { X, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface ChatPanelHeaderProps {
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

const ChatPanelHeader = ({ onClose, title, subtitle }: ChatPanelHeaderProps) => {
  const isMobile = useIsMobile();
  const displayTitle = title || (isMobile ? "Waly" : "Waly Assistant");
  const walyAvatarPath = "/lovable-uploads/e48e0f44-7e54-4337-b0ea-8893795682ba.png";

  return (
    <motion.div 
      className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-4 flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Avatar className="h-14 w-14 bg-white/20 border-2 border-white/30 ring-2 ring-white/10 shadow-lg">
            <AvatarImage src={walyAvatarPath} alt="Waly" className="p-1.5" />
            <AvatarFallback className="bg-gradient-to-br from-white/90 to-white/70 text-primary">
              <Sparkles className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="flex flex-col">
          <motion.h2 
            className="font-medium text-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {displayTitle}
          </motion.h2>
          {subtitle && (
            <motion.p 
              className="text-sm text-white/80"
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
          <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/20 shadow-sm ml-3">Pro</Badge>
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

export default ChatPanelHeader;
