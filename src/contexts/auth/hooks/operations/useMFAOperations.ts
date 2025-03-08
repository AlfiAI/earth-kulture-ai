
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { captureException } from "@/services/monitoring/errorTracking";

export const useMFAOperations = () => {
  // Multi-factor authentication
  const setupMFA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });

      if (error) throw error;
      
      return {
        qr: data.totp.qr_code,
        secret: data.totp.secret
      };
    } catch (error: any) {
      console.error("Error setting up MFA:", error);
      captureException(error);
      toast.error(error.message || "Failed to set up MFA");
      return null;
    }
  };

  const verifyMFA = async (token: string) => {
    try {
      // First, we need to create a challenge
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: 'totp'
      });
      
      if (challengeError) throw challengeError;
      
      // Then verify the challenge with the token
      const { error } = await supabase.auth.mfa.verify({
        factorId: 'totp',
        challengeId: challengeData.id,
        code: token
      });

      if (error) throw error;
      
      toast.success("MFA verification successful");
      return true;
    } catch (error: any) {
      console.error("Error verifying MFA:", error);
      captureException(error);
      toast.error(error.message || "Failed to verify MFA token");
      return false;
    }
  };

  const disableMFA = async () => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: 'totp'
      });

      if (error) throw error;
      
      toast.success("MFA has been disabled");
      return true;
    } catch (error: any) {
      console.error("Error disabling MFA:", error);
      captureException(error);
      toast.error(error.message || "Failed to disable MFA");
      return false;
    }
  };

  return {
    setupMFA,
    verifyMFA,
    disableMFA
  };
};
