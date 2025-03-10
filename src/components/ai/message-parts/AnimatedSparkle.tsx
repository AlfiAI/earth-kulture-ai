
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AnimatedSparkleProps {
  size?: number;
  color?: string;
  className?: string;
  delay?: number;
  duration?: number;
}

const AnimatedSparkle = ({ 
  size = 16,
  color = "text-yellow-300",
  className = "",
  delay = 0,
  duration = 2
}: AnimatedSparkleProps) => {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
        rotate: [0, 5, 0]
      }}
      transition={{ 
        duration, 
        delay,
        repeat: Infinity,
        repeatType: "loop" as const 
      }}
    >
      <Sparkles className={`h-${size/4} w-${size/4} ${color}`} />
    </motion.div>
  );
};

export default AnimatedSparkle;
