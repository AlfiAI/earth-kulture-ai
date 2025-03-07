
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { PricingPlanProps } from "./types";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "@/services/subscription/subscriptionService";
import { toast } from "sonner";
import { useState } from "react";

interface PricingPlanComponentProps {
  plan: PricingPlanProps;
}

const PricingPlan = ({ plan }: PricingPlanComponentProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to subscribe");
      navigate("/auth");
      return;
    }

    if (plan.planType === 'Enterprise') {
      // For Enterprise plan, redirect to contact page or show contact modal
      toast.info("Our team will contact you shortly for Enterprise plan setup");
      return;
    }

    setIsSubscribing(true);
    try {
      const result = await subscriptionService.subscribeToPlan(plan.planType);
      if (result) {
        toast.success(`Successfully subscribed to ${plan.name} plan!`);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe to the plan. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div 
      className={`relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all 
        ${plan.popular ? 'border-primary shadow-md' : 'border-border'}`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
          Popular
        </div>
      )}
      
      <div className="mb-6 space-y-2">
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{plan.price}</span>
            {plan.price !== "Custom" && (
              <span className="text-muted-foreground">/month</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {plan.description}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Features included:</h4>
        <ul className="grid gap-2.5">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
          
          {plan.notIncluded && plan.notIncluded.length > 0 && (
            <>
              <li className="h-px bg-border my-2" />
              {plan.notIncluded.map((feature, index) => (
                <li key={`not-${index}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
      
      <div className="mt-auto pt-6">
        <Button 
          variant={plan.popular ? "default" : "outline"} 
          className="w-full" 
          onClick={handleSubscribe}
          disabled={isSubscribing}
        >
          {isSubscribing ? "Processing..." : plan.cta}
        </Button>
      </div>
    </div>
  );
};

export default PricingPlan;
