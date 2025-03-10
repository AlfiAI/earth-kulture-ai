
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { itemVariants, cardHoverVariants } from '@/styles/animations';

interface AnimatedCardProps {
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  footer?: ReactNode;
  children: ReactNode;
}

const AnimatedCard = ({
  title,
  description,
  className,
  contentClassName,
  footer,
  children
}: AnimatedCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      whileTap="tap"
      custom={cardHoverVariants}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-200 h-full bg-gradient-to-br from-card to-card/80 border-primary/10",
        className
      )}>
        {(title || description) && (
          <CardHeader className="pb-2 px-4 pt-4">
            {title && (
              <CardTitle className="text-md font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </CardTitle>
            )}
            {description && (
              <CardDescription className="text-xs">
                {description}
              </CardDescription>
            )}
          </CardHeader>
        )}
        
        <CardContent className={cn("pt-2 px-4", contentClassName)}>
          {children}
        </CardContent>
        
        {footer && (
          <CardFooter className="border-t pt-3 px-4 text-xs text-muted-foreground">
            {footer}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
