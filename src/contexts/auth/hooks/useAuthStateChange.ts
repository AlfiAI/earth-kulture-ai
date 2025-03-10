
import { useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../types";

type FetchUserProfileFn = (userId: string) => Promise<any>;

export const useAuthStateChange = (
  setSession: (session: Session | null) => void,
  setUser: (user: User | null) => void,
  setUserProfile: (profile: UserProfile | null) => void,
  fetchUserProfile: FetchUserProfileFn
) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle URL hash fragments for auth redirects
    const handleHashParams = async () => {
      if (window.location.hash && window.location.hash.includes('access_token')) {
        console.log("Detected auth redirect in URL hash, handling...");
        // Supabase will automatically handle this with detectSessionInUrl
      }
    };
    
    handleHashParams();

    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          try {
            const profileData = await fetchUserProfile(newSession.user.id);
            console.log("Fetched profile data:", profileData);
            
            if (profileData) {
              setUserProfile(profileData);
            } else {
              // Set basic profile if we couldn't fetch from database
              setUserProfile({
                id: newSession.user.id,
                email: newSession.user.email || '',
                full_name: '',
                avatar_url: ''
              });
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setUserProfile({
              id: newSession.user.id,
              email: newSession.user.email || '',
              full_name: '',
              avatar_url: ''
            });
          }
        } else {
          setUserProfile(null);
        }
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            const redirectTo = localStorage.getItem("redirectAfterLogin") || "/dashboard";
            console.log("User signed in, redirecting to:", redirectTo);
            navigate(redirectTo);
            localStorage.removeItem("redirectAfterLogin");
            toast.success("Successfully signed in!");
            break;
            
          case 'SIGNED_OUT':
            console.log("User signed out, redirecting to auth page");
            navigate('/auth');
            toast.info("You have been signed out");
            break;
            
          case 'USER_UPDATED':
            toast.success("Your profile has been updated");
            break;
            
          case 'PASSWORD_RECOVERY':
            // Handle password recovery event
            toast.info("Password reset successful");
            break;
            
          case 'TOKEN_REFRESHED':
            // Session token was refreshed
            console.log("Session token refreshed");
            break;
            
          // Removed the invalid USER_DELETED case as it's not a valid AuthChangeEvent in Supabase
        }
      }
    );
    
    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate, setSession, setUser, setUserProfile, fetchUserProfile]);
};
