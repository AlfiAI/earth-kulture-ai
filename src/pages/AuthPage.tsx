
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthContainer from '@/components/auth/AuthContainer';
import LegalDisclaimer from '@/components/auth/LegalDisclaimer';
import { useIsMobile } from '@/hooks/use-mobile';

const AuthPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, error } = useAuth0();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful!");
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      console.error('Auth0 error:', error);
      toast.error(`Authentication error: ${error.message}`);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'} mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in slide-up`}>
        <AuthHeader authMode={authMode} />
        
        <AuthContainer 
          authMode={authMode} 
          setAuthMode={setAuthMode} 
        />
        
        <LegalDisclaimer />
      </div>
    </div>
  );
};

export default AuthPage;
