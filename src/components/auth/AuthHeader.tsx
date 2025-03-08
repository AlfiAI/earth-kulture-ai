
import { motion } from 'framer-motion';
import { itemVariants } from './authAnimations';

type AuthHeaderProps = {
  authMode: 'login' | 'signup' | 'reset-password';
};

const AuthHeader = ({ authMode }: AuthHeaderProps) => {
  const title = 
    authMode === 'login' ? 'Sign In to Your Account' : 
    authMode === 'signup' ? 'Create an Account' : 
    'Reset Password';
    
  const description = 
    authMode === 'login' ? 'Enter your credentials to access your account' : 
    authMode === 'signup' ? 'Start your journey to better carbon management' : 
    'Enter your email to receive a password reset link';

  return (
    <motion.div 
      className="text-center space-y-2"
      variants={itemVariants}
    >
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
        {description}
      </p>
    </motion.div>
  );
};

export default AuthHeader;
