
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buttonVariants } from '@/styles/animations';

interface AnimatedGradientButtonProps extends ButtonProps {
  gradient?: 'primary' | 'secondary' | 'accent';
}

const AnimatedGradientButton = forwardRef<HTMLButtonElement, AnimatedGradientButtonProps>(
  ({ className, children, gradient = 'primary', ...props }, ref) => {
    const gradientClasses = {
      primary: 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600',
      secondary: 'bg-gradient-to-r from-primary to-primary/70',
      accent: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
    };

    return (
      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
      >
        <Button
          ref={ref}
          className={cn(gradientClasses[gradient], 'text-white shadow-sm hover:shadow-md transition-all', className)}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedGradientButton.displayName = 'AnimatedGradientButton';

export default AnimatedGradientButton;
