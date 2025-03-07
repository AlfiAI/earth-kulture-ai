
import { PricingPlanProps, FAQItemProps } from './types';

export const pricingPlans: PricingPlanProps[] = [
  {
    name: "Starter",
    price: "$99",
    description: "Perfect for small businesses just beginning their sustainability journey.",
    features: [
      "Carbon footprint calculation (Scope 1 & 2)",
      "Basic ESG score tracking",
      "Monthly reports",
      "Email support",
      "Up to 3 team members"
    ],
    notIncluded: [
      "AI-powered insights",
      "Scope 3 emissions tracking",
      "Custom reporting"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Professional",
    price: "$299",
    description: "Comprehensive solution for growing organizations with sustainability goals.",
    features: [
      "Carbon footprint calculation (Scope 1, 2 & 3)",
      "Advanced ESG score tracking",
      "Weekly reports",
      "AI-powered insights",
      "Compliance tracking for major frameworks",
      "Priority support",
      "Up to 10 team members"
    ],
    notIncluded: [
      "Custom API integrations",
      "Dedicated account manager"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solution for large organizations with complex sustainability needs.",
    features: [
      "All Professional features",
      "Unlimited team members",
      "Custom API integrations",
      "Dedicated account manager",
      "On-site training",
      "Custom reporting",
      "24/7 priority support"
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false
  }
];

export const faqItems: FAQItemProps[] = [
  {
    question: "Can I switch plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades will take effect at the end of your billing cycle."
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes, we offer a 14-day free trial on our Professional plan so you can experience the full power of Earth Kulture before committing."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, ACH payments, and wire transfers for annual enterprise plans."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription at any time through your account settings or by contacting our support team. Your plan will remain active until the end of your billing period."
  }
];
