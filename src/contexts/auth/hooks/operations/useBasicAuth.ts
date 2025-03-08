
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { captureException } from "@/services/monitoring/errorTracking";
import { MFASignInResult } from "../../types";

export const useBasicAuth = () => {
  const signIn = async (email: string, password: string, rememberMe: boolean = false): Promise<MFASignInResult> => {
    try {
      // Support for demo account
      if (email === 'demo@example.com' && password === 'password123') {
        console.log("Using demo account credentials");
      }
      
      // Fix the options structure to match Supabase API expectations
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      // Handle remember me functionality through localStorage
      if (rememberMe) {
        localStorage.setItem('supabase-remember-me', 'true');
      } else {
        localStorage.removeItem('supabase-remember-me');
      }
      
      if (error) throw error;

      // Check if MFA is required
      if (data?.session?.user?.factors && data.session.user.factors.length > 0) {
        return { requiresMFA: true, factorId: data.session.user.factors[0].id };
      }

      return { requiresMFA: false };
    } catch (error: any) {
      console.error("Error signing in:", error);
      captureException(error);
      
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Please verify your email before signing in. Check your inbox for a verification link.");
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
      captureException(error);
      
      if (error.message.includes("User already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(error.message || "Failed to sign up");
      }
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing out:", error);
      captureException(error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signOut
  };
};
