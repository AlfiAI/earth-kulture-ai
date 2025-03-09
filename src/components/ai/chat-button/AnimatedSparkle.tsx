
import { Sparkles } from 'lucide-react';
import { motion } from "framer-motion";

const AnimatedSparkle = () => {
  return (
    <motion.div
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
      className="absolute -top-1 -right-1"
    >
      <Sparkles className="h-4 w-4 text-yellow-300" />
    </motion.div>
  );
};

export default AnimatedSparkle;
