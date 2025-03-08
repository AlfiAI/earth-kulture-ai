
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const LoadingContent = () => {
  return (
    <motion.div 
      className="flex justify-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <LoadingSpinner />
    </motion.div>
  );
};

export default LoadingContent;
