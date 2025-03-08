
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { UserProfile } from "./types";

export const useAuthProvider = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile from Supabase
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

  // Initialize auth session
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      
      try {
        // Check for hash fragment in URL which could indicate a redirect from OAuth
        const hasHashParams = window.location.hash && window.location.hash.length > 0;
        if (hasHashParams) {
          console.log("Hash params detected, handling auth redirect");
        }
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          toast.error(`Authentication error: ${error.message}`);
        } else {
          setSession(session);
          setUser(session?.user || null);
          
          // If we have a user, fetch their profile
          if (session?.user) {
            const profileData = await fetchUserProfile(session.user.id);
            if (profileData) {
              // Map profile data to UserProfile type
              setUserProfile({
                id: profileData.id,
                email: session.user.email || '', // Use email from session user
                full_name: profileData.full_name || '',
                avatar_url: profileData.avatar_url || ''
              });
            } else {
              // Create a minimal profile if none exists
              setUserProfile({
                id: session.user.id,
                email: session.user.email || '',
                full_name: '',
                avatar_url: ''
              });
            }
          }
        }
      } catch (error) {
        console.error("Unexpected error in auth initialization:", error);
      } finally {
        // Always set loading to false, even if there was an error
        setIsLoading(false);
      }
    };
    
    // Fetch the session immediately
    fetchSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // Handle user profile when session changes
        if (newSession?.user) {
          const profileData = await fetchUserProfile(newSession.user.id);
          if (profileData) {
            // Map to UserProfile type
            setUserProfile({
              id: profileData.id,
              email: newSession.user.email || '', // Use email from session user
              full_name: profileData.full_name || '',
              avatar_url: profileData.avatar_url || ''
            });
          } else {
            // Create a minimal profile if none exists
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
        
        // Redirect logic
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
    
    // Set a timeout to stop showing loading state even if there's an issue
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    // Cleanup subscription and timeout
    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, [navigate]);
  
  // Authentication methods
  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      // Special handling for demo account
      if (email === 'demo@example.com' && password === 'password123') {
        console.log("Using demo account credentials");
      }
      
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: {
          // Control session duration based on rememberMe checkbox
          // Default session duration is 1 hour (3600 seconds)
          // Extended session (if rememberMe) is 30 days (2592000 seconds)
          expiresIn: rememberMe ? 2592000 : 3600
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in:", error);
      
      // Provide more helpful error messages
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(error.message || "Failed to sign in");
      }
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      // Get the current site URL dynamically
      const currentUrl = window.location.origin;
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${currentUrl}/auth`,
          data: {
            full_name: '',
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Please check your email to verify your account. Check your spam folder if you don't see it.");
    } catch (error: any) {
      console.error("Error signing up:", error);
      
      // Provide more specific error messages
      if (error.message.includes("User already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(error.message || "Failed to sign up");
      }
      throw error;
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      // Get the current site URL dynamically
      const currentUrl = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${currentUrl}/auth`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast.error(error.message || "Failed to sign in with Google");
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Get the current site URL dynamically
      const currentUrl = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${currentUrl}/auth`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset instructions sent to your email");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Failed to send password reset email");
      throw error;
    }
  };

  return {
    session,
    user,
    userProfile,
    isAuthenticated: !!session,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  };
};
