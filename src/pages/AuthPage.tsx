
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AuthContainer from "@/components/auth/AuthContainer";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset-password'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  
  // Get the intended redirect path from localStorage or URL state
  const redirectPath = 
    (location.state?.from) || 
    localStorage.getItem("redirectAfterLogin") || 
    "/dashboard";

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

  // Add emergency demo login option
  const handleDemoLogin = async () => {
    try {
      setIsDemo(true);
      await signIn("demo@earthkulture.com", "demo123456");
      toast.success("Logged in with demo account");
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      console.error("Demo login error:", error);
      setAuthError(error.message);
    } finally {
      setIsDemo(false); // Reset demo state regardless of outcome
    }
  };

  // Add debugging console logs
  console.log("AuthPage rendering with mode:", authMode);
  console.log("AuthContainer props:", { authMode, authError });

  return (
    <AuthPageLayout>
      <div className="w-full max-w-md flex flex-col gap-4">
        <AuthContainer 
          authMode={authMode} 
          setAuthMode={setAuthMode} 
          setAuthError={setAuthError}
          authError={authError}
        />
        
        {!isAuthenticated && (
          <button 
            onClick={handleDemoLogin}
            disabled={isDemo}
            className="mt-4 w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors disabled:opacity-70"
          >
            {isDemo ? "Logging in with demo account..." : "Login with Demo Account (For MVP Presentation)"}
          </button>
        )}
      </div>
    </AuthPageLayout>
  );
};

export default AuthPage;
