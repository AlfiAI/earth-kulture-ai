
import React from 'react';
import { motion } from 'framer-motion';

type AuthToggleProps = {
  authMode: 'login' | 'signup' | 'reset-password';
  setAuthMode: React.Dispatch<React.SetStateAction<'login' | 'signup' | 'reset-password'>>;
};

const AuthToggle = ({ authMode, setAuthMode }: AuthToggleProps) => {
  // Don't show toggle on reset-password screen
  if (authMode === 'reset-password') {
    return null;
  }

  return (
    <motion.div 
      className="text-center text-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 500, delay: 0.2 }}
    >
      {authMode === 'login' ? (
        <p>
          Don't have an account?{" "}
          <button 
            onClick={() => setAuthMode('signup')} 
            className="text-primary hover:underline font-medium transition-colors"
          >
            Sign up
          </button>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <button 
            onClick={() => setAuthMode('login')} 
            className="text-primary hover:underline font-medium transition-colors"
          >
            Sign in
          </button>
        </p>
      )}
    </motion.div>
  );
};

export default AuthToggle;
