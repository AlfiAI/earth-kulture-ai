
import PricingHeader from '@/components/pricing/PricingHeader';
import PricingHero from '@/components/pricing/PricingHero';
import PricingPlansSection from '@/components/pricing/PricingPlansSection';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import PricingCTA from '@/components/pricing/PricingCTA';
import PricingFooter from '@/components/pricing/PricingFooter';
import { pricingPlans, faqItems } from '@/components/pricing/pricingData';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <PricingHeader />
      <PricingHero />
      <PricingPlansSection plans={pricingPlans} />
      <PricingFAQ faqs={faqItems} />
      <PricingCTA />
      <PricingFooter />
    </div>
  );
};

export default Pricing;
