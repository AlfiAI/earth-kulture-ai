
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from '@/styles/animations';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <motion.h1 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mt-1 text-sm text-muted-foreground"
          >
            {description}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div 
          variants={itemVariants} 
          initial="hidden"
          animate="visible"
          className="mt-4 sm:mt-0"
        >
          {action}
        </motion.div>
      )}
    </div>
  );
};

export default PageHeader;
