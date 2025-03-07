
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionStatus } from "@/components/pricing/types";
import { toast } from "sonner";

class SubscriptionService {
  async getCurrentSubscription(): Promise<SubscriptionStatus | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.user.id)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned is not an error for us
          console.error("Error fetching subscription:", error);
          throw error;
        }
        return null;
      }
      
      return data as SubscriptionStatus;
    } catch (error) {
      console.error("Error in getCurrentSubscription:", error);
      return null;
    }
  }
  
  async subscribeToPlan(planType: 'Free' | 'Pro' | 'Enterprise'): Promise<SubscriptionStatus | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast.error("You must be logged in to subscribe to a plan");
        return null;
      }
      
      // Set expiration date (null for Free, 30 days for Pro, 1 year for Enterprise)
      let expiresAt = null;
      if (planType === 'Pro') {
        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
      } else if (planType === 'Enterprise') {
        expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year
      }
      
      // Insert new subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.user.id,
          plan: planType,
          status: 'Active',
          started_at: new Date().toISOString(),
          expires_at: expiresAt
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error subscribing to plan:", error);
        toast.error("Failed to subscribe to the plan");
        throw error;
      }
      
      toast.success(`Successfully subscribed to the ${planType} plan`);
      return data as SubscriptionStatus;
    } catch (error) {
      console.error("Error in subscribeToPlan:", error);
      return null;
    }
  }
  
  async cancelSubscription(): Promise<boolean> {
    try {
      const currentSubscription = await this.getCurrentSubscription();
      
      if (!currentSubscription) {
        toast.error("No active subscription found");
        return false;
      }
      
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'Canceled' })
        .eq('id', currentSubscription.id);
        
      if (error) {
        console.error("Error canceling subscription:", error);
        toast.error("Failed to cancel subscription");
        throw error;
      }
      
      toast.success("Subscription successfully canceled");
      return true;
    } catch (error) {
      console.error("Error in cancelSubscription:", error);
      return false;
    }
  }
}

export const subscriptionService = new SubscriptionService();
