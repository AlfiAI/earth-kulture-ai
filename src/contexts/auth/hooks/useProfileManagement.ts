
import { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types";

export const useProfileManagement = (
  user: User | null, 
  setUserProfile: (profile: UserProfile | null) => void
) => {
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      } 
      
      return data;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const profileData = await fetchUserProfile(user.id);
          if (profileData) {
            setUserProfile({
              id: profileData.id,
              email: user.email || '',
              full_name: profileData.full_name || '',
              avatar_url: profileData.avatar_url || ''
            });
          } else {
            // Set a minimal profile even if fetching from DB fails
            setUserProfile({
              id: user.id,
              email: user.email || '',
              full_name: '',
              avatar_url: ''
            });
            console.log("Created minimal profile due to fetch failure");
          }
        } catch (error) {
          console.error("Failed to load user profile:", error);
          // Still set a minimal profile on error
          setUserProfile({
            id: user.id,
            email: user.email || '',
            full_name: '',
            avatar_url: ''
          });
          console.log("Created minimal profile due to error");
        }
      } else {
        setUserProfile(null);
      }
    };

    loadUserProfile();
  }, [user, setUserProfile]);

  return { fetchUserProfile };
};
