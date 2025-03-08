
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
    signOut, 
    resetPassword,
    setupMFA,
    verifyMFA,
    disableMFA 
  } = useAuthOperations();
  
  useAuthStateChange(
    (newSession) => newSession !== session && setSession(newSession),
    (newUser) => newUser !== user && setUser(newUser),
    setUserProfile,
    fetchUserProfile
  );

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
    signOut,
    resetPassword,
    setupMFA,
    verifyMFA,
    disableMFA
  };
};
