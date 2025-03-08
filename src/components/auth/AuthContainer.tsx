
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm from "./EmailLoginForm";
import SocialLoginButtons from "./SocialLoginButtons";
import AuthToggle from "./AuthToggle";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "@/contexts/auth";
import * as z from "zod";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

type AuthContainerProps = {
  authMode: 'login' | 'signup' | 'reset-password';
  setAuthMode: React.Dispatch<React.SetStateAction<'login' | 'signup' | 'reset-password'>>;
  setAuthError: React.Dispatch<React.SetStateAction<string | null>>;
};

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const AuthContainer = ({ authMode, setAuthMode, setAuthError }: AuthContainerProps) => {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [componentLoading, setComponentLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    setAuthError(null);
    setSignupSuccess(false);
    
    try {
      if (authMode === 'login') {
        // Pass the rememberMe option to signIn
        await signIn(values.email, values.password, rememberMe);
      } else if (authMode === 'signup') {
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

  const handleResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      await resetPassword(values.email);
      setResetPasswordSuccess(true);
      resetPasswordForm.reset();
    } catch (error: any) {
      console.error("Password reset error:", error);
      setAuthError(error.message || "Failed to send password reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (componentLoading) {
    return <LoadingSpinner />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        when: "afterChildren",
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 500 }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 }
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
      {signupSuccess && (
        <motion.div variants={itemVariants}>
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm">
              Account created successfully! Please check your email for verification. If you don't see the email, check your spam folder or try signing in directly.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
      
      {resetPasswordSuccess && (
        <motion.div variants={itemVariants}>
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm">
              Password reset email sent! Please check your inbox and follow the instructions to reset your password.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
      
      {authMode === 'reset-password' ? (
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 mr-2" 
              onClick={() => setAuthMode('login')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-medium">Reset Password</h2>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your email address and we will send you a link to reset your password.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Form {...resetPasswordForm}>
              <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
                <FormField
                  control={resetPasswordForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your@email.com" 
                          {...field} 
                          className="h-10 text-base"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size={isMobile ? "default" : "lg"}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" /> 
                      <span className="ml-2">Sending...</span>
                    </>
                  ) : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      ) : (
        <>
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
