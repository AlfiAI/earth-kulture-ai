
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import LoadingContent from './LoadingContent';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, authError } = useAuth();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    // If not authenticated and not loading, start redirect process
    if (!isLoading && !isAuthenticated && !redirecting) {
      // Store the current path for redirecting back after login
      localStorage.setItem('redirectAfterLogin', location.pathname);
      toast.error("Please sign in to access this page");
      setRedirecting(true);
    }

    // Safety mechanism to prevent infinite loading
    const timer = setTimeout(() => {
      setWaitTime(prev => prev + 1);
      if (waitTime > 5 && isLoading) {
        console.log("Auth loading taking too long, forcing redirect");
        setRedirecting(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, location.pathname, redirecting, waitTime]);

  // If loading for more than 5 seconds, show a more informative message
  if (isLoading && waitTime <= 5) {
    return <LoadingContent />;
  }

  // If loading takes too long or we get auth errors, show an enhanced loading state
  if ((isLoading && waitTime > 5) || authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <LoadingContent />
          <p className="mt-4 text-muted-foreground">
            {authError ? `Authentication error: ${authError}` : "Taking longer than expected..."}
          </p>
          <button 
            onClick={() => window.location.href = '/auth'} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Go to login page
          </button>
        </div>
      </div>
    );
  }

  // If redirecting or not authenticated, redirect to auth page
  if (redirecting || !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If authenticated and not loading, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
