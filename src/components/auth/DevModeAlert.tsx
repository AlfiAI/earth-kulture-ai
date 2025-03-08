
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { toast } from 'sonner';
import { itemVariants } from './authAnimations';

const DevModeAlert = () => {
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Function to handle email verification reminder
  const handleEmailVerificationReminder = () => {
    toast.info("Please check your email for verification link. Don't forget to check your spam folder.", {
      duration: 8000,
    });
  };

  // Function to navigate to Supabase dashboard for dev purposes
  const navigateToSupabaseSettings = () => {
    window.open("https://supabase.com/dashboard/project/ihijlloxwfjrrnhxqlfa/auth/providers", "_blank");
  };

  return (
    <motion.div variants={itemVariants}>
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-xs">
          <p className="font-medium">Developer Note:</p>
          <p>For development, email verification is enabled by default in Supabase.</p>
          <div className="mt-2 space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7 bg-white" 
              onClick={navigateToSupabaseSettings}
            >
              Go to Auth Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7 bg-white" 
              onClick={handleEmailVerificationReminder}
            >
              Email Reminder
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default DevModeAlert;
