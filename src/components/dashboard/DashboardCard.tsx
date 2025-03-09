
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <Card className={cn("overflow-hidden transition-all duration-200 animate-in h-full", className)}>
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      
      <CardContent className={cn("pt-2 px-4", contentClassName)}>
        {children}
      </CardContent>
      
      {footer && <CardFooter className="border-t pt-3 px-4 text-xs text-muted-foreground">{footer}</CardFooter>}
    </Card>
  );
};

export default DashboardCard;
