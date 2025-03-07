
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm from "./EmailLoginForm";
import SocialLoginButtons from "./SocialLoginButtons";
import AuthToggle from "./AuthToggle";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "@/contexts/auth";
import * as z from "zod";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";

type AuthContainerProps = {
  authMode: 'login' | 'signup';
  setAuthMode: React.Dispatch<React.SetStateAction<'login' | 'signup'>>;
};

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const AuthContainer = ({ authMode, setAuthMode }: AuthContainerProps) => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [componentLoading, setComponentLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleFormSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    setAuthError(null);
    setSignupSuccess(false);
    
    try {
      if (authMode === 'login') {
        await signIn(values.email, values.password);
      } else {
        await signUp(values.email, values.password);
        setSignupSuccess(true);
        // Switch to login mode after successful signup
        setAuthMode('login');
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      // Handle specific error cases
      if (error.message.includes("Invalid login credentials")) {
        if (authMode === 'login') {
          setAuthError("Invalid email or password. If you recently signed up, please check your email for verification.");
        } else {
          setAuthError("Authentication failed. Please try again with different credentials.");
        }
      } else if (error.message.includes("User already registered")) {
        setAuthError("This email is already registered. Please sign in instead.");
        setAuthMode('login');
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
        await signInWithGoogle();
      }
    } catch (error: any) {
      console.error(`Error with ${provider} login:`, error);
      setAuthError(error.message || `Failed to sign in with ${provider}`);
    }
  };

  if (componentLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
      {signupSuccess && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <Info className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-sm">
            Account created successfully! Please check your email for verification. If you don't see the email, check your spam folder or try signing in directly.
          </AlertDescription>
        </Alert>
      )}
      
      {authError && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">{authError}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="space-y-4">
          <EmailLoginForm 
            onSubmit={handleFormSubmit} 
            authMode={authMode} 
            isSubmitting={isSubmitting}
          />
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4">
          <SocialLoginButtons onSocialLogin={handleSocialLogin} />
        </TabsContent>
      </Tabs>
      
      <AuthToggle authMode={authMode} setAuthMode={setAuthMode} />
      
      {authMode === 'login' && (
        <div className="text-xs text-center text-muted-foreground">
          <p>For development, you can sign in with: demo@example.com / password123</p>
        </div>
      )}
    </div>
  );
};

export default AuthContainer;
