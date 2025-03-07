
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Leaf, LogIn, Github, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const AuthPage = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, isLoading, error } = useAuth0();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful!");
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      console.error('Auth0 error:', error);
      toast.error(`Authentication error: ${error.message}`);
    }
  }, [error]);

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
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

  // Direct login without form for testing - can be removed in production
  const handleDirectLogin = () => {
    console.log("Attempting direct login");
    loginWithRedirect();
  };

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
            <h2 className="text-xl font-semibold">
              {authMode === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {authMode === 'login' 
                ? 'Access your organization\'s sustainability dashboard' 
                : 'Join Earth Kulture to start monitoring your sustainability metrics'}
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
            <>
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email" className="space-y-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" size="lg">
                        {authMode === 'login' ? 'Sign In' : 'Sign Up'} 
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="social" className="space-y-4">
                  <div className="grid gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => handleSocialLogin('google-oauth2')}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                      Continue with Google
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => handleSocialLogin('github')}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Continue with GitHub
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="text-center text-sm">
                {authMode === 'login' ? (
                  <p>
                    Don't have an account?{" "}
                    <button 
                      onClick={() => setAuthMode('signup')} 
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button 
                      onClick={() => setAuthMode('login')} 
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
              
              {/* Fallback login option if regular methods don't work */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center mb-2">Having trouble signing in?</p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleDirectLogin}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Continue with Auth0 Universal Login
                </Button>
              </div>
            </>
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
