
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
    console.log("ProtectedRoute state:", { isAuthenticated, isLoading, authError });
    
    // If not authenticated and not loading, start redirect process
    if (!isLoading && !isAuthenticated && !redirecting) {
      console.log("Not authenticated, storing current path:", location.pathname);
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

  // Show loading state for a reasonable time
  if (isLoading && waitTime <= 5) {
    return <LoadingContent />;
  }

  // If redirecting or not authenticated, redirect to auth page
  if (redirecting || !isAuthenticated) {
    console.log("Redirecting to auth page from:", location.pathname);
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If authenticated and not loading, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
