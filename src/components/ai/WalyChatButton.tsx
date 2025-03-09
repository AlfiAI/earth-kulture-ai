
import { Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
          "relative flex items-center justify-center p-0 w-16 h-16 rounded-full shadow-xl",
          "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600",
          "hover:shadow-emerald-500/20 hover:shadow-2xl transition-all duration-300"
        )}
      >
        <Avatar className="w-14 h-14 border-2 border-white/20 overflow-visible">
          <AvatarImage 
            src="/lovable-uploads/f6c4395f-ff31-485c-b1bb-af97a26dd5e5.png" 
            alt="Waly Bot"
            className="object-contain p-1" 
          />
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
            W
          </AvatarFallback>
        </Avatar>
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
      </Button>
    </motion.div>
  );
};

export default WalyChatButton;
