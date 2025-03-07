
import React from 'react';

type AuthToggleProps = {
  authMode: 'login' | 'signup';
  setAuthMode: React.Dispatch<React.SetStateAction<'login' | 'signup'>>;
};

const AuthToggle = ({ authMode, setAuthMode }: AuthToggleProps) => {
  return (
    <div className="text-center text-sm">
      {authMode === 'login' ? (
        <p>
          Don't have an account?{" "}
          <button 
            onClick={() => setAuthMode('signup')} 
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <button 
            onClick={() => setAuthMode('login')} 
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      )}
    </div>
  );
};

export default AuthToggle;
