
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AuthContainer from "@/components/auth/AuthContainer";
import { useAuth } from "@/contexts/auth";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const redirectPath = localStorage.getItem("redirectAfterLogin") || "/dashboard";
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset-password'>('login');
  const [authError, setAuthError] = useState<string | null>(null);

  // Detect which authentication screen to show based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/signup") setAuthMode('signup');
    else if (path === "/forgot-password") setAuthMode('reset-password');
    else setAuthMode('login');
  }, [location.pathname]);

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard or original destination
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
      localStorage.removeItem("redirectAfterLogin");
    }
  }, [isAuthenticated, navigate, redirectPath]);

  return (
    <AuthPageLayout>
      <AuthContainer 
        authMode={authMode} 
        setAuthMode={setAuthMode} 
        setAuthError={setAuthError} 
      />
    </AuthPageLayout>
  );
};

export default AuthPage;
