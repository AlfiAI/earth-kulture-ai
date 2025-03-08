
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthOperations = () => {
  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      if (email === 'demo@example.com' && password === 'password123') {
        console.log("Using demo account credentials");
      }
      
      // Fix the options structure to match Supabase API expectations
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: {
          captchaToken: undefined // This is the only valid property at this level
        }
      });
      
      // Handle remember me functionality through localStorage instead
      if (rememberMe) {
        localStorage.setItem('supabase-remember-me', 'true');
      } else {
        localStorage.removeItem('supabase-remember-me');
      }
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in:", error);
      
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(error.message || "Failed to sign in");
      }
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      // Get the current site URL for redirect
      const currentUrl = window.location.origin;
      console.log("Signup with redirect to:", `${currentUrl}/auth`);
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${currentUrl}/auth`,
          data: {
            full_name: '',
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Please check your email to verify your account. Check your spam folder if you don't see it.");
    } catch (error: any) {
      console.error("Error signing up:", error);
      
      if (error.message.includes("User already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(error.message || "Failed to sign up");
      }
      throw error;
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      const currentUrl = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${currentUrl}/auth`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast.error(error.message || "Failed to sign in with Google");
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const currentUrl = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${currentUrl}/auth`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset instructions sent to your email");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Failed to send password reset email");
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  };
};
