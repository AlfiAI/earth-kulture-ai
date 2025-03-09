
import { useAuth } from "@/contexts/auth";

export const useUserAvatar = () => {
  const { userProfile } = useAuth();
  
  // Return the user's avatar URL if available, or undefined if not
  return {
    avatarUrl: userProfile?.avatar_url || undefined,
    initials: userProfile?.full_name 
      ? userProfile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      : userProfile?.email?.substring(0, 2)?.toUpperCase() || 'U'
  };
};
