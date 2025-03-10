
import { motion } from "framer-motion";

const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div 
        className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-primary/10 to-cyan-500/10 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" as const }}
      />
      <motion.div 
        className="absolute bottom-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-emerald-500/10 to-primary/10 blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" as const, delay: 1 }}
      />
    </div>
  );
};

export default BackgroundEffects;
