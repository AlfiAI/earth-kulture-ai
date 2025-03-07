
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type FallbackLoginButtonProps = {
  onDirectLogin: () => void;
};

const FallbackLoginButton = ({ onDirectLogin }: FallbackLoginButtonProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border">
      <p className="text-xs sm:text-sm text-muted-foreground text-center mb-2">Having trouble signing in?</p>
      <Button
        variant="secondary"
        className="w-full text-xs sm:text-sm"
        size={isMobile ? "sm" : "default"}
        onClick={onDirectLogin}
      >
        <LogIn className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        Continue with Auth0 Universal Login
      </Button>
    </div>
  );
};

export default FallbackLoginButton;
