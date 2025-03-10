
import { useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../types";

type FetchUserProfileFn = (userId: string) => Promise<any>;

// Define the possible auth event types to include all events we're handling
type AuthEventType = 
  | 'INITIAL_SESSION' 
  | 'SIGNED_IN' 
  | 'SIGNED_OUT' 
  | 'USER_UPDATED' 
  | 'USER_DELETED' 
  | 'PASSWORD_RECOVERY'
  | 'TOKEN_REFRESHED'
  | 'MFA_CHALLENGE_VERIFIED';

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthEventType, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          // Fetch user profile when we have a session
          try {
            const profileData = await fetchUserProfile(newSession.user.id);
            if (profileData) {
              setUserProfile({
                id: profileData.id,
                email: newSession.user.email || '',
                full_name: profileData.full_name || '',
                avatar_url: profileData.avatar_url || ''
              });
            } else {
              // Set basic profile if we couldn't fetch from database
              setUserProfile({
                id: newSession.user.id,
                email: newSession.user.email || '',
                full_name: '',
                avatar_url: ''
              });
              console.log("Set minimal profile due to failed fetch");
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Still set a basic profile on error
            setUserProfile({
              id: newSession.user.id,
              email: newSession.user.email || '',
              full_name: '',
              avatar_url: ''
            });
            console.log("Set minimal profile due to error");
          }
        } else {
          setUserProfile(null);
        }
        
        // Handle different auth events
        if (event === 'SIGNED_IN') {
          // Get stored redirect path or default to dashboard
          const redirectTo = localStorage.getItem("redirectAfterLogin") || "/dashboard";
          
          try {
            // Check if this is a new user by seeing if they have a profile with data
            const profileData = newSession?.user ? await fetchUserProfile(newSession.user.id) : null;
            const isNewUser = !profileData?.full_name;
            
            if (isNewUser) {
              // Redirect to onboarding for new users
              navigate('/onboarding');
              toast.success("Account created! Let's set up your profile.");
            } else {
              // Regular login for existing users - use the stored redirect path
              navigate(redirectTo);
              toast.success("Login successful!");
            }
          } catch (error) {
            console.error("Error during post-login navigation:", error);
            // Fall back to dashboard on error
            navigate('/dashboard');
            toast.success("Login successful!");
          }
          
          // Clear the stored redirect path after using it
          localStorage.removeItem("redirectAfterLogin");
        } else if (event === 'SIGNED_OUT') {
          navigate('/auth');
          toast.success("You have been logged out");
        } else if (event === 'USER_UPDATED') {
          toast.success("Your profile has been updated");
        } else if (event === 'PASSWORD_RECOVERY') {
          toast.success("Password recovery email sent");
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("Auth token refreshed");
        } else if (event === 'USER_DELETED') {
          navigate('/auth');
          toast.info("Your account has been deleted");
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setSession, setUser, setUserProfile, fetchUserProfile]);
};
