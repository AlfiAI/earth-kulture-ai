
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm from "./EmailLoginForm";
import SocialLoginButtons from "./SocialLoginButtons";
import AuthToggle from "./AuthToggle";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
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
  const { signIn, signUp, signInWithGoogle, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleFormSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      if (authMode === 'login') {
        await signIn(values.email, values.password);
      } else {
        await signUp(values.email, values.password);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setAuthError(error.message || "Authentication failed. Please try again.");
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
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
    </div>
  );
};

export default AuthContainer;
