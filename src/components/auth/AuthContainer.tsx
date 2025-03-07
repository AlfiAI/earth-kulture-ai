
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth0 } from "@auth0/auth0-react";
import EmailLoginForm from "./EmailLoginForm";
import SocialLoginButtons from "./SocialLoginButtons";
import AuthToggle from "./AuthToggle";
import FallbackLoginButton from "./FallbackLoginButton";
import LoadingSpinner from "./LoadingSpinner";
import * as z from "zod";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

type AuthContainerProps = {
  authMode: 'login' | 'signup';
  setAuthMode: React.Dispatch<React.SetStateAction<'login' | 'signup'>>;
  configError?: boolean;
};

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const AuthContainer = ({ authMode, setAuthMode, configError = false }: AuthContainerProps) => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const isMobile = useIsMobile();

  const handleFormSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log("Attempting login with:", values.email);
    // Using Auth0's email/password authentication
    loginWithRedirect({
      authorizationParams: {
        screen_hint: authMode === 'signup' ? 'signup' : undefined,
        login_hint: values.email,
      }
    });
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Attempting social login with provider: ${provider}`);
    loginWithRedirect({
      authorizationParams: {
        connection: provider,
      }
    });
  };

  const handleDirectLogin = () => {
    console.log("Attempting direct login");
    loginWithRedirect();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return null; // Handled by parent component's useEffect
  }

  if (configError) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            To use authentication, configure Auth0 in your environment variables:
            <ul className="list-disc pl-5 mt-2 text-xs sm:text-sm">
              <li>VITE_AUTH0_DOMAIN</li>
              <li>VITE_AUTH0_CLIENT_ID</li>
              <li>(Optional) VITE_AUTH0_AUDIENCE</li>
            </ul>
          </AlertDescription>
        </Alert>
        <div className="pt-2 text-center text-muted-foreground text-xs sm:text-sm">
          <p>Demo mode: Authentication is currently disabled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="space-y-4">
          <EmailLoginForm onSubmit={handleFormSubmit} authMode={authMode} />
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4">
          <SocialLoginButtons onSocialLogin={handleSocialLogin} />
        </TabsContent>
      </Tabs>
      
      <AuthToggle authMode={authMode} setAuthMode={setAuthMode} />
      
      <FallbackLoginButton onDirectLogin={handleDirectLogin} />
    </div>
  );
};

export default AuthContainer;
