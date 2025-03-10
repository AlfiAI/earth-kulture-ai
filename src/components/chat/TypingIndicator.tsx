
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Sparkles } from "lucide-react";

const TypingIndicator = () => {
  const walyAvatarPath = "/lovable-uploads/e48e0f44-7e54-4337-b0ea-8893795682ba.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 items-start p-2"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Avatar className="h-10 w-10 border-2 border-emerald-100 shadow-md">
          <AvatarImage src={walyAvatarPath} alt="Waly" className="p-1" />
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </motion.div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl p-4 max-w-[75%] shadow-md bg-white/95 backdrop-blur-sm border border-emerald-100/50"
      >
        <div className="flex space-x-2">
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
          />
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, delay: 0.2, repeat: Infinity, repeatType: "loop" }}
          />
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, delay: 0.4, repeat: Infinity, repeatType: "loop" }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className="mt-1.5 text-xs text-emerald-500/70 font-medium"
        >
          Waly thinking...
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TypingIndicator;
