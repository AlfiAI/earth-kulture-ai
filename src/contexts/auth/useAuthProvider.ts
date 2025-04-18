
import { useAuthState } from "./hooks/useAuthState";
import { useProfileManagement } from "./hooks/useProfileManagement";
import { useAuthOperations } from "./hooks/useAuthOperations";
import { UserContext, UserProfile } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { IndustryType, UserRoleType } from "@/services/ai/orchestration/types/agentTypes";

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

  // Implement the missing getUserContext method with proper type handling
  const getUserContext = async (): Promise<UserContext> => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // If userProfile is missing, create a minimal context
    if (!userProfile) {
      console.warn("User profile not loaded, returning minimal context");
      return {
        userId: user.id,
        tenantId: undefined,
        industry: IndustryType.CORPORATE,
        role: UserRoleType.VIEWER,
        preferences: {
          dashboardType: 'business' as 'business' | 'individual' | 'enterprise',
          dataVisualizationPreference: 'visual' as 'detailed' | 'summary' | 'visual',
          reportFrequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'quarterly'
        }
      };
    }
    
    return {
      userId: user.id,
      tenantId: undefined, // Since this doesn't exist in profiles table
      industry: (userProfile.industry as IndustryType) || IndustryType.CORPORATE,
      role: (userProfile.role as UserRoleType) || UserRoleType.VIEWER,
      preferences: {
        dashboardType: (userProfile.dashboard_preference || 'business') as 'business' | 'individual' | 'enterprise',
        dataVisualizationPreference: (userProfile.data_visualization_preference || 'visual') as 'detailed' | 'summary' | 'visual',
        reportFrequency: (userProfile.report_frequency || 'monthly') as 'daily' | 'weekly' | 'monthly' | 'quarterly'
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
