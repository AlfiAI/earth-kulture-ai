
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm from "./EmailLoginForm";
import SocialLoginButtons from "./SocialLoginButtons";
import AuthToggle from "./AuthToggle";
import ResetPasswordForm from "./ResetPasswordForm";
import AnimatedAlert from "./AnimatedAlert";
import AuthError from "./AuthError";
import MFAVerification from "./MFAVerification";
import { useAuth } from "@/contexts/auth";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./authAnimations";

type AuthContainerProps = {
  authMode: 'login' | 'signup' | 'reset-password';
  setAuthMode: React.Dispatch<React.SetStateAction<'login' | 'signup' | 'reset-password'>>;
  setAuthError: React.Dispatch<React.SetStateAction<string | null>>;
  authError: string | null;
};

const AuthContainer = ({ authMode, setAuthMode, setAuthError, authError }: AuthContainerProps) => {
  const { signIn, signUp, signInWithGoogle, signInWithGithub, signInWithLinkedIn, resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showMFAVerification, setShowMFAVerification] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("email");

  // Listen for Waly AI auth actions
  useEffect(() => {
    const handleWalyAuthAction = (event: CustomEvent) => {
      const { action } = event.detail;
      if (action === 'login') {
        setAuthMode('login');
      } else if (action === 'signup') {
        setAuthMode('signup');
      }
    };

    window.addEventListener('waly-auth-action', handleWalyAuthAction as EventListener);
    return () => {
      window.removeEventListener('waly-auth-action', handleWalyAuthAction as EventListener);
    };
  }, [setAuthMode]);

  // Custom effect to clear errors when changing modes or tabs
  useEffect(() => {
    setAuthError(null);
  }, [authMode, activeTab, setAuthError]);

  const handleFormSubmit = async (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    setAuthError(null);
    setSignupSuccess(false);
    
    try {
      if (authMode === 'login') {
        console.log("Attempting login with email:", values.email);
        const result = await signIn(values.email, values.password, rememberMe);
        
        // Check if MFA is required
        if (result.requiresMFA) {
          setShowMFAVerification(true);
          setMfaFactorId(result.factorId);
        }
      } else if (authMode === 'signup') {
        console.log("Attempting signup with email:", values.email);
        await signUp(values.email, values.password);
        setSignupSuccess(true);
        setAuthMode('login');
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      if (error.message.includes("Invalid login credentials")) {
        if (authMode === 'login') {
          setAuthError("Invalid email or password. If you recently signed up, please check your email for verification.");
        } else {
          setAuthError("Authentication failed. Please try again with different credentials.");
        }
      } else if (error.message.includes("User already registered")) {
        setAuthError("This email is already registered. Please sign in instead.");
        setAuthMode('login');
      } else if (error.message.includes("Email not confirmed")) {
        setAuthError("Please verify your email before signing in. Check your inbox for a verification link.");
      } else {
        setAuthError(error.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSocialLogin = async (provider: string) => {
    setAuthError(null);
    try {
      if (provider === 'google') {
        console.log("Attempting Google login");
        await signInWithGoogle();
      } else if (provider === 'github') {
        console.log("Attempting GitHub login");
        await signInWithGithub();
      } else if (provider === 'linkedin') {
        console.log("Attempting LinkedIn login");
        await signInWithLinkedIn();
      }
    } catch (error: any) {
      console.error(`Error with ${provider} login:`, error);
      
      if (error.message.includes("provider is not enabled")) {
        setAuthError(`${provider} login is not enabled. Please use email login instead or contact the administrator to enable ${provider} authentication.`);
      } else {
        setAuthError(error.message || `Failed to sign in with ${provider}`);
      }
    }
  };

  const handleResetPassword = async (email: string) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      await resetPassword(email);
      setResetPasswordSuccess(true);
    } catch (error: any) {
      console.error("Password reset error:", error);
      setAuthError(error.message || "Failed to send password reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="bg-card rounded-lg shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {authError && <AuthError error={authError} />}
      
      {signupSuccess && (
        <motion.div variants={itemVariants}>
          <AnimatedAlert 
            variant="success" 
            message="Account created successfully! Please check your email for verification. If you don't see the email, check your spam folder or try signing in directly."
          />
        </motion.div>
      )}
      
      {resetPasswordSuccess && (
        <motion.div variants={itemVariants}>
          <AnimatedAlert 
            variant="success" 
            message="Password reset email sent! Please check your inbox and follow the instructions to reset your password."
          />
        </motion.div>
      )}
      
      {authMode === 'reset-password' ? (
        <ResetPasswordForm 
          onBack={() => setAuthMode('login')}
          onSubmit={handleResetPassword}
          isSubmitting={isSubmitting}
        />
      ) : showMFAVerification ? (
        <MFAVerification 
          onBack={() => setShowMFAVerification(false)} 
          factorId={mfaFactorId}
        />
      ) : (
        <>
          <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4">
              <EmailLoginForm 
                onSubmit={handleFormSubmit} 
                authMode={authMode} 
                isSubmitting={isSubmitting}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                onResetPassword={() => setAuthMode('reset-password')}
              />
            </TabsContent>
            
            <TabsContent value="social" className="space-y-4">
              <SocialLoginButtons onSocialLogin={handleSocialLogin} />
            </TabsContent>
          </Tabs>
          
          <AuthToggle authMode={authMode} setAuthMode={setAuthMode} />
          
          {authMode === 'login' && process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-center text-muted-foreground">
              <p>For development, you can sign in with: demo@example.com / password123</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default AuthContainer;
