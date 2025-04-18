
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import LoadingContent from './LoadingContent';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, authError, signIn } = useAuth();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);
  const [waitTime, setWaitTime] = useState(0);
  const [tryingDemo, setTryingDemo] = useState(false);

  useEffect(() => {
    console.log("ProtectedRoute state:", { isAuthenticated, isLoading, authError });
    
    // If not authenticated and not loading, start redirect process
    if (!isLoading && !isAuthenticated && !redirecting && !tryingDemo) {
      console.log("Not authenticated, storing current path:", location.pathname);
      localStorage.setItem('redirectAfterLogin', location.pathname);
      
      // For MVP demo purposes, try auto-login with demo account
      const isDemoEnvironment = 
        window.location.hostname.includes('lovable.app') || 
        window.location.hostname.includes('vercel.app');
      
      if (isDemoEnvironment) {
        setTryingDemo(true);
        signIn("demo@earthkulture.com", "demo123456")
          .then(() => {
            console.log("Demo auto-login successful");
          })
          .catch((error) => {
            console.error("Demo auto-login failed:", error);
            toast.error("Please sign in to access this page");
            setRedirecting(true);
          });
      } else {
        toast.error("Please sign in to access this page");
        setRedirecting(true);
      }
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
  }, [isAuthenticated, isLoading, location.pathname, redirecting, waitTime, tryingDemo, signIn]);

  // Show loading state for a reasonable time
  if ((isLoading && waitTime <= 5) || tryingDemo) {
    return <LoadingContent />;
  }

  // If redirecting or not authenticated, redirect to auth page
  if (redirecting || !isAuthenticated) {
    console.log("Redirecting to auth page from:", location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated and not loading, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
