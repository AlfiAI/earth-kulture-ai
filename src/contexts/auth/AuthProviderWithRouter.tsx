
import { ReactNode, useEffect } from 'react';
import { AuthProvider } from './AuthContext';
import { useAuthStateChange } from "./hooks/useAuthStateChange";
import { useNavigate } from 'react-router-dom';
import { User, Session } from "@supabase/supabase-js";
import { UserProfile } from "./types";
import { supabase } from "@/integrations/supabase/client";

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
  const [authError, setAuthError] = React.useState<Error | null>(null);
  
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
          setUserProfile(profileData);
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

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
