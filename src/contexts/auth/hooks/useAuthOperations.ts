
import { MFASignInResult } from "../types";
import { useBasicAuth } from "./operations/useBasicAuth";
import { useSocialAuth } from "./operations/useSocialAuth";
import { usePasswordReset } from "./operations/usePasswordReset";
import { useMFAOperations } from "./operations/useMFAOperations";

export const useAuthOperations = () => {
  const { signIn, signUp, signOut } = useBasicAuth();
  const { signInWithGoogle, signInWithGithub, signInWithLinkedIn } = useSocialAuth();
  const { resetPassword } = usePasswordReset();
  const { setupMFA, verifyMFA, disableMFA } = useMFAOperations();

  return {
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
  };
};
