
import { Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

type AuthHeaderProps = {
  authMode: 'login' | 'signup' | 'reset-password';
};

const AuthHeader = ({ authMode }: AuthHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    }
  };

  const titleVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: 0.1
      }
    }
  };

  return (
    <>
      <motion.div 
        className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center space-x-2 cursor-pointer z-10" 
        onClick={() => navigate('/')}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        <span className="font-bold text-lg sm:text-xl">Earth Kulture</span>
      </motion.div>
      
      <motion.div 
        className="flex justify-center"
        variants={logoVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 text-primary">
          <Leaf className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
      </motion.div>
      
      <motion.div 
        className="text-center space-y-1 sm:space-y-2"
        variants={titleVariants}
        initial="initial"
        animate="animate"
      >
        <h1 className="text-xl sm:text-2xl font-bold">Earth Kulture</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">ESG & Carbon Intelligence Platform</p>
      </motion.div>

      <motion.div 
        className="text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
      >
        <h2 className="text-lg sm:text-xl font-semibold">
          {authMode === 'login' 
            ? 'Sign in to your account' 
            : authMode === 'signup'
              ? 'Create a new account'
              : 'Reset your password'}
        </h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
          {authMode === 'login' 
            ? 'Access your organization\'s sustainability dashboard' 
            : authMode === 'signup'
              ? 'Join Earth Kulture to start monitoring your sustainability metrics'
              : 'We\'ll send you a link to reset your password'}
        </p>
      </motion.div>
    </>
  );
};

export default AuthHeader;
