
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { captureException } from "@/services/monitoring/errorTracking";

// Get the current site URL dynamically to properly handle redirects
const getSiteUrl = () => {
  // In browser environment
  if (typeof window !== 'undefined') {
    // First check if we're running in the preview environment
    if (window.location.hostname.includes('preview--') || 
        window.location.hostname.includes('lovable.app')) {
      return window.location.origin;
    }
    
    // For local development or other deployments
    const url = new URL(window.location.href);
    return `${url.protocol}//${url.host}`;
  }
  // Fallback for non-browser environments
  return 'http://localhost:8080';
};

export const useSocialAuth = () => {
  const signInWithGoogle = async () => {
    try {
      const redirectUrl = `${getSiteUrl()}/auth`;
      console.log("Signing in with Google, redirect URL:", redirectUrl);
      
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        if (error.message.includes("provider is not enabled")) {
          console.error("Google provider is not enabled in Supabase:", error);
          toast.error("Google authentication is not enabled. Please contact support or use email login.", {
            duration: 7000,
            action: {
              label: 'How to Fix',
              onClick: () => window.open('https://supabase.com/dashboard/project/ihijlloxwfjrrnhxqlfa/auth/providers', '_blank')
            }
          });
          throw new Error("Google provider is not enabled in Supabase Auth settings. Go to Supabase Dashboard > Authentication > Providers to enable it.");
        }
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      captureException(error);
      
      // Show more specific error message
      if (error.message.includes("provider is not enabled")) {
        toast.error("Google authentication is not enabled. Please use email login or contact support.");
      } else {
        toast.error(error.message || "Failed to sign in with Google");
      }
      
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      const redirectUrl = `${getSiteUrl()}/auth`;
      console.log("Signing in with GitHub, redirect URL:", redirectUrl);
      
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl
        }
      });
      
      if (error) {
        if (error.message.includes("provider is not enabled")) {
          console.error("GitHub provider is not enabled in Supabase:", error);
          toast.error("GitHub authentication is not enabled. Please contact support or use email login.", {
            duration: 7000,
            action: {
              label: 'How to Fix',
              onClick: () => window.open('https://supabase.com/dashboard/project/ihijlloxwfjrrnhxqlfa/auth/providers', '_blank')
            }
          });
          throw new Error("GitHub provider is not enabled in Supabase Auth settings");
        }
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error("Error signing in with GitHub:", error);
      captureException(error);
      
      // Show more specific error message
      if (error.message.includes("provider is not enabled")) {
        toast.error("GitHub authentication is not enabled. Please use email login or contact support.");
      } else {
        toast.error(error.message || "Failed to sign in with GitHub");
      }
      
      throw error;
    }
  };

  const signInWithLinkedIn = async () => {
    try {
      const redirectUrl = `${getSiteUrl()}/auth`;
      console.log("Signing in with LinkedIn, redirect URL:", redirectUrl);
      
      // Use LinkedIn OIDC provider instead of deprecated LinkedIn provider
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: redirectUrl,
          scopes: 'r_liteprofile r_emailaddress'
        }
      });
      
      if (error) {
        if (error.message.includes("provider is not enabled")) {
          console.error("LinkedIn provider is not enabled in Supabase:", error);
          toast.error("LinkedIn authentication is not enabled. Please contact support or use email login.", {
            duration: 7000,
            action: {
              label: 'How to Fix',
              onClick: () => window.open('https://supabase.com/dashboard/project/ihijlloxwfjrrnhxqlfa/auth/providers', '_blank')
            }
          });
          throw new Error("LinkedIn provider is not enabled in Supabase Auth settings");
        }
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error("Error signing in with LinkedIn:", error);
      captureException(error);
      
      // Show more specific error message
      if (error.message.includes("provider is not enabled")) {
        toast.error("LinkedIn authentication is not enabled. Please use email login or contact support.");
      } else {
        toast.error(error.message || "Failed to sign in with LinkedIn");
      }
      
      throw error;
    }
  };

  return {
    signInWithGoogle,
    signInWithGithub,
    signInWithLinkedIn
  };
};
