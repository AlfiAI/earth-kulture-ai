
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
      className={`container mx-auto px-3 py-4 md:px-4 md:py-6 max-w-full overflow-x-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageContainer;
