
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types";
import { toast } from "sonner";

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      
      try {
        const hasHashParams = window.location.hash && window.location.hash.length > 0;
        if (hasHashParams) {
          console.log("Hash params detected, handling auth redirect");
          
          // Additional logging for debugging hash params
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const errorParam = hashParams.get('error');
          const errorDescription = hashParams.get('error_description');
          
          if (errorParam) {
            console.error("Auth redirect error:", errorParam, errorDescription);
            setAuthError(`${errorParam}: ${errorDescription}`);
            toast.error(`Authentication error: ${errorDescription || errorParam}`);
          }
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          setAuthError(error.message);
          toast.error(`Authentication error: ${error.message}`);
        } else {
          setSession(session);
          setUser(session?.user || null);
          setAuthError(null);
        }
      } catch (error: any) {
        console.error("Unexpected error in auth initialization:", error);
        setAuthError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event);
        setSession(session);
        setUser(session?.user || null);
        
        if (event === 'SIGNED_IN') {
          toast.success("Successfully signed in!");
        } else if (event === 'SIGNED_OUT') {
          toast.info("You have been signed out");
        } else if (event === 'USER_UPDATED') {
          toast.success("Your profile has been updated");
        }
      }
    );
    
    // Fallback timeout to ensure loading state doesn't get stuck
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  return {
    session,
    user,
    userProfile,
    setUserProfile,
    isAuthenticated: !!session,
    isLoading,
    setSession,
    setUser,
    authError,
    setAuthError
  };
};
