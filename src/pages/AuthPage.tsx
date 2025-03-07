
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthContainer from '@/components/auth/AuthContainer';
import LegalDisclaimer from '@/components/auth/LegalDisclaimer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'} mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in slide-up`}>
        <AuthHeader authMode={authMode} />
        
        {isLoading ? (
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
