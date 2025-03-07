
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthContainer from '@/components/auth/AuthContainer';
import LegalDisclaimer from '@/components/auth/LegalDisclaimer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import { Button } from '@/components/ui/button';

const AuthPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const isMobile = useIsMobile();
  const [authError, setAuthError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to stop showing loading state even if auth context is still loading
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);

    // If auth state resolves before timeout, clear the timeout
    if (!isLoading) {
      setPageLoading(false);
      clearTimeout(timer);
    }
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
      toast.success("You are now signed in!");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Function to handle email verification reminder
  const handleEmailVerificationReminder = () => {
    toast.info("Please check your email for verification link. Don't forget to check your spam folder.", {
      duration: 8000,
    });
  };

  // Function to navigate to Supabase dashboard for dev purposes
  const navigateToSupabaseSettings = () => {
    window.open("https://supabase.com/dashboard/project/ihijlloxwfjrrnhxqlfa/auth/providers", "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'} mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in slide-up`}>
        <AuthHeader authMode={authMode} />
        
        {authError && (
          <Alert variant="destructive" className="border-destructive/50 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        {/* Developer note */}
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-xs">
            <p className="font-medium">Developer Note:</p>
            <p>For development, email verification is enabled by default in Supabase.</p>
            <div className="mt-2 space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 bg-white" 
                onClick={navigateToSupabaseSettings}
              >
                Go to Auth Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 bg-white" 
                onClick={handleEmailVerificationReminder}
              >
                Email Reminder
              </Button>
            </div>
          </AlertDescription>
        </Alert>
        
        {pageLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AuthContainer 
            authMode={authMode} 
            setAuthMode={setAuthMode}
          />
        )}
        
        <LegalDisclaimer />
      </div>
    </div>
  );
};

export default AuthPage;
