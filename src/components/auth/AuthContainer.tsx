
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AuthHeader from "./AuthHeader";
import AuthForm from "./AuthForm";
import AuthToggle from "./AuthToggle";
import SocialLoginButtons from "./SocialLoginButtons";
import LegalDisclaimer from "./LegalDisclaimer";
import { Separator } from "@/components/ui/separator";
import AuthError from "./AuthError";
import MFASetup from "./MFASetup";
import MFAVerification from "./MFAVerification";
import DevModeAlert from "./DevModeAlert";
import OTPExpiryWarning from "./OTPExpiryWarning";
import { containerVariants, itemVariants } from "./authAnimations";
import { useAuth } from "@/contexts/auth";

type AuthContainerProps = {
  authMode: 'login' | 'signup' | 'reset-password';
  setAuthMode: (mode: 'login' | 'signup' | 'reset-password') => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;
};

const AuthContainer = ({ 
  authMode, 
  setAuthMode, 
  authError, 
  setAuthError 
}: AuthContainerProps) => {
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [showMFAVerification, setShowMFAVerification] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const { signInWithGoogle, signInWithGithub, signInWithLinkedIn } = useAuth();

  // Clear any auth errors when changing modes
  useEffect(() => {
    setAuthError(null);
  }, [authMode, setAuthError]);

  // Handle social login methods
  const handleSocialLogin = (provider: string) => {
    try {
      switch (provider) {
        case 'google':
          signInWithGoogle();
          break;
        case 'github':
          signInWithGithub();
          break;
        case 'linkedin':
          signInWithLinkedIn();
          break;
        default:
          console.error('Unsupported provider:', provider);
      }
    } catch (error) {
      console.error('Error during social login:', error);
      setAuthError('Failed to initialize social login. Please try again.');
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <DevModeAlert />
      
      <OTPExpiryWarning />
      
      {authError && (
        <AuthError error={authError} onDismiss={() => setAuthError(null)} />
      )}
      
      {showMFASetup ? (
        <MFASetup onComplete={() => setShowMFASetup(false)} />
      ) : showMFAVerification && mfaFactorId ? (
        <MFAVerification factorId={mfaFactorId} />
      ) : (
        <>
          <motion.div variants={itemVariants}>
            <AuthHeader authMode={authMode} />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <AuthForm 
              authMode={authMode} 
              onMFARequired={(factorId) => {
                setMfaFactorId(factorId);
                setShowMFAVerification(true);
              }}
              onError={setAuthError}
            />
          </motion.div>
          
          {authMode !== 'reset-password' && (
            <>
              <motion.div variants={itemVariants} className="my-6 flex items-center">
                <Separator className="flex-grow" />
                <span className="px-4 text-sm text-gray-500">or</span>
                <Separator className="flex-grow" />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <SocialLoginButtons onSocialLogin={handleSocialLogin} />
              </motion.div>
            </>
          )}
          
          <motion.div variants={itemVariants} className="mt-6">
            <AuthToggle 
              authMode={authMode} 
              onModeChange={setAuthMode} 
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-8">
            <LegalDisclaimer />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default AuthContainer;
