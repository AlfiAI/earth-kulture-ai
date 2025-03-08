
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      
      try {
        const hasHashParams = window.location.hash && window.location.hash.length > 0;
        if (hasHashParams) {
          console.log("Hash params detected, handling auth redirect");
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          toast.error(`Authentication error: ${error.message}`);
        } else {
          setSession(session);
          setUser(session?.user || null);
        }
      } catch (error) {
        console.error("Unexpected error in auth initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSession();
    
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [navigate]);

  return {
    session,
    user,
    userProfile,
    setUserProfile,
    isAuthenticated: !!session,
    isLoading,
    setSession,
    setUser
  };
};
