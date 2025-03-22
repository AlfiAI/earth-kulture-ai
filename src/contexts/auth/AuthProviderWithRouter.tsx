
import React, { ReactNode, useEffect } from 'react';
import { AuthProvider } from './AuthContext';
import { useAuthStateChange } from "./hooks/useAuthStateChange";
import { useNavigate } from 'react-router-dom';
import { User, Session } from "@supabase/supabase-js";
import { UserProfile } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { IndustryType, UserRoleType } from "@/services/ai/orchestration/types/agentTypes";

// This component wraps AuthProvider with router functionality
// It must be used INSIDE a Router context
export const AuthProviderWithRouter = ({ children }: { children: ReactNode }) => {
  // Get navigate function from router context
  const navigate = useNavigate();
  
  // State management for auth context
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [authError, setAuthError] = React.useState<string | null>(null);
  
  // Fetch user profile function
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Set up auth state change listener with router navigation
  useAuthStateChange(
    setSession,
    setUser,
    setUserProfile,
    fetchUserProfile,
    navigate // Pass the navigate function
  );
  
  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        setSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session?.user) {
          const profileData = await fetchUserProfile(data.session.user.id);
          if (profileData) {
            // Make sure the profile data includes the email field
            setUserProfile({
              id: profileData.id,
              email: data.session.user.email || '',
              full_name: profileData.full_name || '',
              avatar_url: profileData.avatar_url || '',
              company: profileData.company || '',
              // Check if role exists and type cast it
              role: profileData.role ? 
                profileData.role as UserRoleType : 
                undefined,
              // Check if industry exists and type cast it
              industry: 'industry' in profileData && profileData.industry ? 
                profileData.industry as IndustryType : 
                undefined
              // Remove the properties that don't exist in the profiles table
            });
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setAuthError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Create the auth context value with all the state and functions
  const authContextValue = {
    session,
    user,
    userProfile,
    isAuthenticated: !!user,
    isLoading,
    authError,
    // These will be implemented in useAuthProvider
    signIn: async () => ({ requiresMFA: false }),
    signUp: async () => {},
    signInWithGoogle: async () => {},
    signInWithGithub: async () => {},
    signInWithLinkedIn: async () => {},
    signOut: async () => {},
    resetPassword: async () => {},
    setupMFA: async () => null,
    verifyMFA: async () => false,
    disableMFA: async () => false,
    updateUserProfile: async () => {},
    getUserContext: async () => ({ 
      userId: user?.id || '', 
      tenantId: undefined,
      industry: IndustryType.CORPORATE,
      role: UserRoleType.VIEWER,
      preferences: {
        dashboardType: 'business' as 'business' | 'individual' | 'enterprise',
        dataVisualizationPreference: 'visual' as 'detailed' | 'summary' | 'visual',
        reportFrequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'quarterly'
      }
    })
  };

  return (
    <AuthProvider value={authContextValue}>
      {children}
    </AuthProvider>
  );
};
