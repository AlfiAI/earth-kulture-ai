
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { captureException } from "@/services/monitoring/errorTracking";

export const useSocialAuth = () => {
  const signInWithGoogle = async () => {
    try {
      const currentUrl = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${currentUrl}/auth`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      captureException(error);
      toast.error(error.message || "Failed to sign in with Google");
      throw error;
    }
  };

  return {
    signInWithGoogle
  };
};
