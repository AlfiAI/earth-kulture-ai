
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          const profileData = await fetchUserProfile(newSession.user.id);
          if (profileData) {
            setUserProfile({
              id: profileData.id,
              email: newSession.user.email || '',
              full_name: profileData.full_name || '',
              avatar_url: profileData.avatar_url || ''
            });
          } else {
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
        
        if (event === 'SIGNED_IN') {
          navigate('/dashboard');
          toast.success("Login successful!");
        } else if (event === 'SIGNED_OUT') {
          navigate('/auth');
          toast.success("You have been logged out");
        } else if (event === 'USER_UPDATED') {
          toast.success("Your profile has been updated");
        } else if (event === 'PASSWORD_RECOVERY') {
          toast.success("Password recovery email sent");
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setSession, setUser, setUserProfile, fetchUserProfile]);
};
