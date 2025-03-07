
import { useEffect, useState } from 'react';
import PricingPlan from './PricingPlan';
import { PricingPlanProps, SubscriptionStatus } from './types';
import { useAuth } from '@/contexts/auth';
import { subscriptionService } from '@/services/subscription/subscriptionService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface PricingPlansSectionProps {
  plans: PricingPlanProps[];
}

const PricingPlansSection = ({ plans }: PricingPlansSectionProps) => {
  const { isAuthenticated } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          const subscription = await subscriptionService.getCurrentSubscription();
          setCurrentSubscription(subscription);
        } catch (error) {
          console.error("Error fetching subscription:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSubscription();
  }, [isAuthenticated]);

  return (
    <section className="container mx-auto px-4 py-8 mb-16">
      {isAuthenticated && currentSubscription && (
        <Alert className="mb-8 bg-muted/50">
          <Info className="h-4 w-4" />
          <AlertTitle>Current Subscription</AlertTitle>
          <AlertDescription>
            You are currently on the <strong>{currentSubscription.plan}</strong> plan. 
            Status: <strong>{currentSubscription.status}</strong>
            {currentSubscription.expires_at && (
              <> (Expires: {new Date(currentSubscription.expires_at).toLocaleDateString()})</>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <PricingPlan key={index} plan={plan} />
        ))}
      </div>
    </section>
  );
};

export default PricingPlansSection;
