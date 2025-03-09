
import { useAuthState } from "./hooks/useAuthState";
import { useProfileManagement } from "./hooks/useProfileManagement";
import { useAuthOperations } from "./hooks/useAuthOperations";
import { useAuthStateChange } from "./hooks/useAuthStateChange";
import { UserContext, UserProfile } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const useAuthProvider = () => {
  const { 
    session, 
    user, 
    userProfile, 
    setUserProfile, 
    isAuthenticated, 
    isLoading,
    setSession,
    setUser,
    authError,
    setAuthError
  } = useAuthState();
  
  const { fetchUserProfile } = useProfileManagement(user, setUserProfile);
  
  const { 
    signIn, 
    signUp, 
    signInWithGoogle,
    signInWithGithub,
    signInWithLinkedIn,
    signOut, 
    resetPassword,
    setupMFA,
    verifyMFA,
    disableMFA 
  } = useAuthOperations();

  // Implement the missing updateUserProfile method
  const updateUserProfile = async (profile: Partial<UserProfile>): Promise<void> => {
    try {
      if (!user) throw new Error("No authenticated user");
      
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      if (userProfile) {
        setUserProfile({ ...userProfile, ...profile });
      }
    } catch (error: any) {
      console.error("Error updating user profile:", error.message);
      throw error;
    }
  };

  // Implement the missing getUserContext method
  const getUserContext = async (): Promise<UserContext> => {
    if (!user || !userProfile) {
      throw new Error("User not authenticated or profile not loaded");
    }
    
    return {
      userId: user.id,
      tenantId: userProfile.tenant_id,
      industry: userProfile.industry || 'corporate',
      role: userProfile.role || 'viewer',
      preferences: {
        dashboardType: userProfile.dashboard_preference || 'business',
        dataVisualizationPreference: userProfile.data_visualization_preference || 'visual',
        reportFrequency: userProfile.report_frequency || 'monthly'
      }
    };
  };

  return {
    session,
    user,
    userProfile,
    isAuthenticated,
    isLoading,
    authError,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    signInWithLinkedIn,
    signOut,
    resetPassword,
    setupMFA,
    verifyMFA,
    disableMFA,
    updateUserProfile,
    getUserContext
  };
};
