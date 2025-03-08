
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { captureException } from "@/services/monitoring/errorTracking";

export const usePasswordReset = () => {
  const resetPassword = async (email: string) => {
    try {
      const currentUrl = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${currentUrl}/auth`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset instructions sent to your email");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      captureException(error);
      toast.error(error.message || "Failed to send password reset email");
      throw error;
    }
  };

  return {
    resetPassword
  };
};
