
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { isAuthenticated, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset-password'>('login');
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

  // Clear error when changing auth mode
  useEffect(() => {
    setAuthError(null);
  }, [authMode]);

  return (
    <AuthPageLayout>
      <motion.div variants={itemVariants}>
        <AuthHeader authMode={authMode} />
      </motion.div>
      
      <AuthError error={authError} />
      <DevModeAlert />
      
      {pageLoading ? (
        <LoadingContent />
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
    </AuthPageLayout>
  );
};

export default AuthPage;
