
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { itemVariants } from './authAnimations';

type AuthErrorProps = {
  error: string | null;
};

const AuthError = ({ error }: AuthErrorProps) => {
  if (!error) return null;
  
  return (
    <motion.div 
      variants={itemVariants}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <Alert variant="destructive" className="border-destructive/50 text-destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default AuthError;
