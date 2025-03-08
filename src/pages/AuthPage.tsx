
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { motion } from 'framer-motion';
import { itemVariants } from '@/components/auth/authAnimations';

// Imported Components
import AuthHeader from '@/components/auth/AuthHeader';
import AuthContainer from '@/components/auth/AuthContainer';
import LegalDisclaimer from '@/components/auth/LegalDisclaimer';
import AuthError from '@/components/auth/AuthError';
import DevModeAlert from '@/components/auth/DevModeAlert';
import LoadingContent from '@/components/auth/LoadingContent';
import AuthPageLayout from '@/components/auth/AuthPageLayout';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, authError } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset-password'>('login');
  const [localAuthError, setLocalAuthError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Combine both auth context errors and local component errors
  const displayError = localAuthError || authError;

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
      // Check if there's a saved redirect path
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/app';
      localStorage.removeItem('redirectAfterLogin'); // Clear the stored path
      
      // Or use the location state if available
      const from = location.state?.from || redirectPath;
      
      navigate(from, { replace: true });
      toast.success("You are now signed in!");
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  // Clear error when changing auth mode
  useEffect(() => {
    setLocalAuthError(null);
  }, [authMode]);

  return (
    <AuthPageLayout>
      <motion.div variants={itemVariants}>
        <AuthHeader authMode={authMode} />
      </motion.div>
      
      <AuthError error={displayError} />
      <DevModeAlert />
      
      {pageLoading ? (
        <LoadingContent />
      ) : (
        <motion.div variants={itemVariants}>
          <AuthContainer 
            authMode={authMode} 
            setAuthMode={setAuthMode}
            setAuthError={setLocalAuthError}
          />
        </motion.div>
      )}
      
      <motion.div variants={itemVariants}>
        <LegalDisclaimer />
      </motion.div>
    </AuthPageLayout>
  );
};

export default AuthPage;
