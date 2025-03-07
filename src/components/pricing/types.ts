
export interface PricingPlanProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  notIncluded: string[];
  cta: string;
  popular: boolean;
}

export interface FAQItemProps {
  question: string;
  answer: string;
}
