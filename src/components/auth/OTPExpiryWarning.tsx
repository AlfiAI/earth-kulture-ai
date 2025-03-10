
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Clock, ExternalLink } from 'lucide-react';
import { itemVariants } from './authAnimations';

const OTPExpiryWarning = () => {
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Function to navigate to Supabase auth settings
  const navigateToSupabaseSettings = () => {
    window.open("https://supabase.com/dashboard/project/ihijlloxwfjrrnhxqlfa/auth/providers", "_blank");
  };

  return (
    <motion.div variants={itemVariants}>
      <Alert className="bg-amber-50 border-amber-200 text-amber-800 mb-4">
        <Clock className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-xs">
          <p className="font-medium">Security Warning:</p>
          <p>The OTP expiry in Supabase is set to more than an hour. For better security, it's recommended to set this value to less than an hour.</p>
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7 bg-white flex items-center gap-1" 
              onClick={navigateToSupabaseSettings}
            >
              View Security Recommendations
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default OTPExpiryWarning;
