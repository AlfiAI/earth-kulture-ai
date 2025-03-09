
import { Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface WalyChatButtonProps {
  onClick: () => void;
  position: { bottom: number; right: number };
}

const WalyChatButton = ({ onClick, position }: WalyChatButtonProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed z-50"
      style={{ bottom: `${position.bottom}rem`, right: `${position.right}rem` }}
    >
      <Button
        onClick={onClick}
        className={cn(
          "rounded-full w-16 h-16 shadow-xl text-white",
          "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600",
          "hover:shadow-emerald-500/20 hover:shadow-2xl transition-all duration-300"
        )}
      >
        <motion.div 
          className="relative flex items-center justify-center"
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, -5, 0, 5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            repeatType: "loop" 
          }}
        >
          <img 
            src="/lovable-uploads/576b2f20-ecd7-4793-bc03-a40c9349e2a1.png" 
            alt="Waly Bot" 
            className="h-11 w-11 object-contain"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "loop" 
            }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="h-4 w-4 text-yellow-300" />
          </motion.div>
        </motion.div>
      </Button>
    </motion.div>
  );
};

export default WalyChatButton;
