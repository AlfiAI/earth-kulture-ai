
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SocialLoginButtonsProps = {
  onSocialLogin: (provider: string) => void;
};

const SocialLoginButtons = ({ onSocialLogin }: SocialLoginButtonsProps) => {
  const [socialError, setSocialError] = useState<string | null>(null);

  const handleGoogleSignIn = () => {
    setSocialError(null);
    
    // Check if we're in development mode, show a helpful message
    if (process.env.NODE_ENV === 'development') {
      toast.info("Make sure Google provider is enabled in Supabase Auth settings", {
        duration: 5000,
        action: {
          label: 'Open Settings',
          onClick: () => window.open('https://supabase.com/dashboard/project/ihijlloxwfjrrnhxqlfa/auth/providers', '_blank')
        }
      });
    }
    
    onSocialLogin('google');
  };

  const handleGithubSignIn = () => {
    setSocialError(null);
    
    // Check if we're in development mode, show a helpful message
    if (process.env.NODE_ENV === 'development') {
      toast.info("Make sure GitHub provider is enabled in Supabase Auth settings", {
        duration: 5000,
        action: {
          label: 'Open Settings',
          onClick: () => window.open('https://supabase.com/dashboard/project/ihijlloxwfjrrnhxqlfa/auth/providers', '_blank')
        }
      });
    }
    
    onSocialLogin('github');
  };

  const handleLinkedInSignIn = () => {
    setSocialError(null);
    
    // Check if we're in development mode, show a helpful message
    if (process.env.NODE_ENV === 'development') {
      toast.info("Make sure LinkedIn provider is enabled in Supabase Auth settings", {
        duration: 5000,
        action: {
          label: 'Open Settings',
          onClick: () => window.open('https://supabase.com/dashboard/project/ihijlloxwfjrrnhxqlfa/auth/providers', '_blank')
        }
      });
    }
    
    onSocialLogin('linkedin');
  };

  return (
    <div className="grid gap-3">
      {socialError && (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{socialError}</AlertDescription>
        </Alert>
      )}

      <Button 
        variant="outline" 
        className="w-full justify-start" 
        onClick={handleGoogleSignIn}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        Continue with Google
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full justify-start" 
        onClick={handleGithubSignIn}
      >
        <Github className="mr-2 h-4 w-4" />
        Continue with GitHub
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full justify-start" 
        onClick={handleLinkedInSignIn}
      >
        <Linkedin className="mr-2 h-4 w-4" />
        Continue with LinkedIn
      </Button>

      <div className="mt-2 text-xs text-center text-muted-foreground">
        <p>Note: Social providers must be enabled in the Supabase dashboard. <br/>Use email signup/login instead.</p>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
