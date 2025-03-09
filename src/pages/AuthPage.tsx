
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AuthContainer from "@/components/auth/AuthContainer";
import { useAuth } from "@/contexts/auth";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const redirectPath = localStorage.getItem("redirectAfterLogin") || "/dashboard";

  // Detect which authentication screen to show based on route
  const getAuthType = () => {
    const path = location.pathname;
    if (path === "/signup") return "signup";
    if (path === "/forgot-password") return "reset";
    if (path === "/setup-mfa") return "mfa-setup";
    return "login";
  };

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard or original destination
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
      localStorage.removeItem("redirectAfterLogin");
    }
  }, [isAuthenticated, navigate, redirectPath]);

  return (
    <AuthPageLayout>
      <AuthContainer initialView={getAuthType()} />
    </AuthPageLayout>
  );
};

export default AuthPage;
