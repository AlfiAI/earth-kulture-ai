
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MFASignInResult } from "../../types";

export const useBasicAuth = () => {
  const [signInError, setSignInError] = useState<Error | null>(null);

  /**
   * Sign in with email and password
   */
  const signIn = async (
    email: string,
    password: string,
    rememberMe: boolean = true
  ): Promise<MFASignInResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Auth error during sign in:", error);
        
        // For demo/MVP purposes, check if it's a demo account and we need to sign up first
        if (email === "demo@earthkulture.com" && 
            (error.message.includes("Invalid login credentials") || 
             error.message.includes("Email not confirmed"))) {
          try {
            // Try to create the demo account
            console.log("Creating demo account for MVP presentation...");
            const { error: signUpError } = await supabase.auth.signUp({
              email: "demo@earthkulture.com",
              password: "demo123456",
              options: {
                data: {
                  full_name: "Demo User",
                  avatar_url: "/placeholder.svg"
                }
              }
            });
            
            if (!signUpError) {
              // Try signing in again
              const { error: retryError } = await supabase.auth.signInWithPassword({
                email: "demo@earthkulture.com",
                password: "demo123456"
              });
              
              if (!retryError) {
                return { requiresMFA: false };
              }
            }
          } catch (demoError) {
            console.error("Error creating demo account:", demoError);
          }
        }
        
        setSignInError(error);
        throw error;
      }

      // Handle MFA if configured (factorId will be present in session data)
      const factorId = data?.session?.user?.factors?.[0]?.id;
      
      if (factorId) {
        return {
          requiresMFA: true,
          factorId
        };
      }

      return { requiresMFA: false };
    } catch (error: any) {
      console.error("Sign in process failed:", error);
      setSignInError(error);
      throw error;
    }
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/auth", // Redirect after email verification
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        throw error;
      }

      toast.success("Please check your email to confirm your account");
    } catch (error: any) {
      console.error("Sign up process failed:", error);
      throw error;
    }
  };

  /**
   * Sign out
   */
  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }

      // Clear any stored routes
      localStorage.removeItem("redirectAfterLogin");
      
    } catch (error: any) {
      console.error("Sign out process failed:", error);
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    signInError,
  };
};
