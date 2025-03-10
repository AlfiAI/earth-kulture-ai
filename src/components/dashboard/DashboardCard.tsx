
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

const DashboardCard = ({
  title,
  description,
  footer,
  className,
  contentClassName,
  children,
}: DashboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-200 h-full bg-gradient-to-br from-card to-card/80 border-primary/10 hover:shadow-md hover:shadow-primary/5", 
        className
      )}>
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-md font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        
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

export default DashboardCard;
