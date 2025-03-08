
import { useAuthState } from "./hooks/useAuthState";
import { useProfileManagement } from "./hooks/useProfileManagement";
import { useAuthOperations } from "./hooks/useAuthOperations";
import { useAuthStateChange } from "./hooks/useAuthStateChange";

export const useAuthProvider = () => {
  const { 
    session, 
    user, 
    userProfile, 
    setUserProfile, 
    isAuthenticated, 
    isLoading 
  } = useAuthState();
  
  const { fetchUserProfile } = useProfileManagement(user, setUserProfile);
  
  const { 
    signIn, 
    signUp, 
    signInWithGoogle, 
    signOut, 
    resetPassword 
  } = useAuthOperations();
  
  useAuthStateChange(
    (newSession) => session !== newSession && setSession(newSession),
    (newUser) => user !== newUser && setUser(newUser),
    setUserProfile,
    fetchUserProfile
  );

  return {
    session,
    user,
    userProfile,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  };
};
