
import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { PricingPlanProps } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService } from '@/services/subscription/subscriptionService';

const PricingPlan = ({ plan }: { plan: PricingPlanProps }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const handlePlanSelection = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to subscribe to a plan");
      navigate('/auth');
      return;
    }
    
    if (plan.planType === 'Enterprise') {
      navigate('/contact');
      return;
    }
    
    try {
      setIsSubscribing(true);
      const success = await subscriptionService.subscribeToPlan(plan.planType);
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      toast.error("Failed to subscribe to plan. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };
  
  return (
    <Card className={`flex flex-col h-full ${plan.popular ? 'border-primary/50 shadow-lg relative' : 'border-border/40'}`}>
      {plan.popular && (
        <Badge className="absolute -top-2 right-4 bg-primary text-primary-foreground">
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-bold">{plan.price}</span>
          {plan.price !== "Custom" && plan.price !== "$0" && <span className="ml-1 text-sm text-muted-foreground">/ month</span>}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">What's included:</h4>
          <ul className="space-y-2">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex text-sm">
                <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          {plan.notIncluded.length > 0 && (
            <>
              <h4 className="text-sm font-medium mt-4">Not included:</h4>
              <ul className="space-y-2">
                {plan.notIncluded.map((feature, i) => (
                  <li key={i} className="flex text-sm text-muted-foreground">
                    <X className="h-4 w-4 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={plan.popular ? "default" : "outline"} 
          className="w-full"
          onClick={handlePlanSelection}
          disabled={isSubscribing}
        >
          {isSubscribing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            plan.cta
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingPlan;
