
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AnimatedSparkleProps {
  size?: number;
  color?: string;
  className?: string;
}

const AnimatedSparkle = ({ 
  size = 16,
  color = "text-yellow-300",
  className = ""
}: AnimatedSparkleProps) => {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
        rotate: [0, 5, 0]
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity,
        repeatType: "loop" 
      }}
    >
      <Sparkles className={`h-${size/4} w-${size/4} ${color}`} />
    </motion.div>
  );
};

export default AnimatedSparkle;
