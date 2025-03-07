
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionStatus } from "@/components/pricing/types";

class SubscriptionService {
  // Get current user's subscription
  async getCurrentSubscription(): Promise<SubscriptionStatus | null> {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching subscription:", error);
        toast.error("Failed to fetch subscription information");
        return null;
      }
      
      return data as SubscriptionStatus;
    } catch (error) {
      console.error("Unexpected error in getCurrentSubscription:", error);
      return null;
    }
  }

  // Subscribe to a new plan
  async subscribeToPlan(planType: 'Free' | 'Pro' | 'Enterprise'): Promise<boolean> {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user) {
        toast.error("You must be logged in to subscribe");
        return false;
      }
      
      // Calculate expiration date (30 days from now for Pro, 1 year for Enterprise)
      const now = new Date();
      let expiresAt = null;
      
      if (planType === 'Pro') {
        expiresAt = new Date(now.setMonth(now.getMonth() + 1)).toISOString();
      } else if (planType === 'Enterprise') {
        expiresAt = new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
      }
      
      // First, check if user already has a subscription
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.session.user.id)
        .maybeSingle();
      
      let result;
      
      if (existingSubscription) {
        // Update existing subscription
        result = await supabase
          .from('subscriptions')
          .update({
            plan: planType,
            status: 'Active',
            started_at: new Date().toISOString(),
            expires_at: expiresAt
          })
          .eq('id', existingSubscription.id);
      } else {
        // Create new subscription
        result = await supabase
          .from('subscriptions')
          .insert({
            user_id: session.session.user.id,
            plan: planType,
            status: 'Active',
            started_at: new Date().toISOString(),
            expires_at: expiresAt
          });
      }
      
      if (result.error) {
        console.error("Error updating subscription:", result.error);
        toast.error("Failed to update subscription");
        return false;
      }
      
      toast.success(`Successfully subscribed to ${planType} plan`);
      return true;
    } catch (error) {
      console.error("Unexpected error in subscribeToPlan:", error);
      toast.error("An unexpected error occurred");
      return false;
    }
  }

  // Cancel subscription
  async cancelSubscription(): Promise<boolean> {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user) {
        toast.error("You must be logged in to cancel your subscription");
        return false;
      }
      
      const { data: subscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.session.user.id)
        .maybeSingle();
      
      if (fetchError || !subscription) {
        console.error("Error fetching subscription:", fetchError);
        toast.error("Failed to find subscription");
        return false;
      }
      
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'Canceled'
        })
        .eq('id', subscription.id);
      
      if (error) {
        console.error("Error canceling subscription:", error);
        toast.error("Failed to cancel subscription");
        return false;
      }
      
      toast.success("Your subscription has been canceled");
      return true;
    } catch (error) {
      console.error("Unexpected error in cancelSubscription:", error);
      toast.error("An unexpected error occurred");
      return false;
    }
  }
}

export const subscriptionService = new SubscriptionService();
