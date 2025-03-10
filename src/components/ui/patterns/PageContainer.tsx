
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { pageTransitionVariants } from '@/styles/animations';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

const PageContainer = ({ children, className = '' }: PageContainerProps) => {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`container mx-auto px-4 py-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageContainer;
