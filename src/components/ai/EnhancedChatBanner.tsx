
import { Brain, Zap, Database, Star, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const EnhancedChatBanner = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-primary/10 to-cyan-500/10 border-b px-4 py-2 flex items-center gap-2"
    >
      <motion.div 
        animate={{ 
          rotate: [-5, 5, -5], 
          scale: [1, 1.1, 1] 
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          repeatType: "reverse" as const 
        }}
      >
        <Brain className="h-4 w-4 text-primary" />
      </motion.div>
      <span className="text-xs text-muted-foreground">DeepSeek-R1 powered intelligence</span>
      <div className="ml-auto flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "reverse" as const 
          }}
          className="flex items-center"
        >
          <Star className="h-3 w-3 text-yellow-500" />
          <span className="text-xs text-yellow-500 font-medium ml-1 mr-2">Advanced AI</span>
        </motion.div>
        <motion.div 
          animate={{ y: [0, -2, 0] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "reverse" as const 
          }}
        >
          <BarChart className="h-3 w-3 text-green-500" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnhancedChatBanner;
