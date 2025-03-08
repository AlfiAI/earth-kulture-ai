
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
import { motion } from 'framer-motion';

const AuthPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset-password'>('login');
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

  // Clear error when changing auth mode
  useEffect(() => {
    setAuthError(null);
  }, [authMode]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 500,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 500 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background py-8 px-4 sm:py-12 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div 
        className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'} mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <AuthHeader authMode={authMode} />
        </motion.div>
        
        {authError && (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Alert variant="destructive" className="border-destructive/50 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {process.env.NODE_ENV === 'development' && (
          <motion.div variants={itemVariants}>
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
          </motion.div>
        )}
        
        {pageLoading ? (
          <motion.div 
            className="flex justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSpinner />
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <AuthContainer 
              authMode={authMode} 
              setAuthMode={setAuthMode}
              setAuthError={setAuthError}
            />
          </motion.div>
        )}
        
        <motion.div variants={itemVariants}>
          <LegalDisclaimer />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
