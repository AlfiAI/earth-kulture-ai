
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  size?: "default" | "sm" | "lg";
  className?: string;
};

const LoadingSpinner = ({ size = "default", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    default: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3"
  };

  return (
    <div className={cn(
      "animate-spin rounded-full border-t-transparent border-primary", 
      sizeClasses[size],
      className
    )}></div>
  );
};

export default LoadingSpinner;
