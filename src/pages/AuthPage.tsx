
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';
import { Leaf, LogIn } from 'lucide-react';
import { toast } from 'sonner';

const AuthPage = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, isLoading, error } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful!");
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(`Authentication error: ${error.message}`);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-6 left-6 flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
        <Leaf className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">Earth Kulture</span>
      </div>
      
      <div className="w-full max-w-md mx-auto p-6 space-y-6 animate-in slide-up">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            <Leaf className="h-6 w-6" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Earth Kulture</h1>
          <p className="text-sm text-muted-foreground">ESG & Carbon Intelligence Platform</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Sign in to your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Access your organization's sustainability dashboard
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : !isAuthenticated && (
            <Button
              onClick={() => loginWithRedirect()}
              className="w-full"
              size="lg"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign in with OAuth
            </Button>
          )}
        </div>
        
        <div className="text-xs text-center text-muted-foreground mt-6">
          By continuing, you agree to Earth Kulture's{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>.
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
