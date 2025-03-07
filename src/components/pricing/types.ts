
export interface PricingPlanProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  notIncluded: string[];
  cta: string;
  popular: boolean;
  planType: 'Free' | 'Pro' | 'Enterprise';
}

export interface FAQItemProps {
  question: string;
  answer: string;
}

export interface SubscriptionStatus {
  id: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Canceled' | 'Pending';
  started_at: string;
  expires_at: string | null;
}
