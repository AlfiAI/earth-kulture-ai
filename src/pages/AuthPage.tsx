
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AuthContainer from "@/components/auth/AuthContainer";
import { useAuth } from "@/contexts/auth";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const redirectPath = localStorage.getItem("redirectAfterLogin") || "/dashboard";
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset-password'>('login');
  const [authError, setAuthError] = useState<string | null>(null);

  // Detect which authentication screen to show based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/signup") setAuthMode('signup');
    else if (path === "/forgot-password") setAuthMode('reset-password');
    else setAuthMode('login');
    
    // Check for error in URL hash fragment
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const errorParam = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');
      
      if (errorParam && errorDescription) {
        console.error("Auth error from URL:", errorParam, errorDescription);
        setAuthError(`${errorParam}: ${errorDescription}`);
      }
    }
  }, [location.pathname]);

  // If user is already authenticated, redirect to dashboard or original destination
  useEffect(() => {
    console.log("AuthPage: Checking auth state...", { isAuthenticated, isLoading, redirectPath });
    
    if (!isLoading && isAuthenticated) {
      console.log("User is authenticated, redirecting to:", redirectPath);
      navigate(redirectPath, { replace: true });
      localStorage.removeItem("redirectAfterLogin");
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath]);

  return (
    <AuthPageLayout>
      <AuthContainer 
        authMode={authMode} 
        setAuthMode={setAuthMode} 
        setAuthError={setAuthError}
        authError={authError}
      />
    </AuthPageLayout>
  );
};

export default AuthPage;
