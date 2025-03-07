
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

type FallbackLoginButtonProps = {
  onDirectLogin: () => void;
};

const FallbackLoginButton = ({ onDirectLogin }: FallbackLoginButtonProps) => {
  return (
    <div className="mt-6 pt-4 border-t border-border">
      <p className="text-sm text-muted-foreground text-center mb-2">Having trouble signing in?</p>
      <Button
        variant="secondary"
        className="w-full"
        onClick={onDirectLogin}
      >
        <LogIn className="mr-2 h-4 w-4" />
        Continue with Auth0 Universal Login
      </Button>
    </div>
  );
};

export default FallbackLoginButton;
