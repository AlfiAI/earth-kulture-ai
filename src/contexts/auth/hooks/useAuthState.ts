
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { UserProfile } from "../types";
import { supabase } from "@/integrations/supabase/client";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("Fetching Supabase session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          throw error;
        }
        
        if (data.session) {
          console.log("Session fetched:", data.session.user?.id || "Unknown user");
          setSession(data.session);
          setUser(data.session.user);
        } else {
          console.log("Session fetched: No session");
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setAuthError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  return {
    user,
    setUser,
    session,
    setSession,
    userProfile,
    setUserProfile,
    isLoading,
    setIsLoading,
    authError,
    setAuthError,
    isAuthenticated: !!user
  };
};
