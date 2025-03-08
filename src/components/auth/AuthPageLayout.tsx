
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { containerVariants, itemVariants } from './authAnimations';

type AuthPageLayoutProps = {
  children: ReactNode;
};

const AuthPageLayout = ({ children }: AuthPageLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background py-8 px-4 sm:py-12 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div 
        className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'} mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AuthPageLayout;
