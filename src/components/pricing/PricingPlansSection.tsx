
import PricingPlan from './PricingPlan';
import { PricingPlanProps } from './types';

interface PricingPlansSectionProps {
  plans: PricingPlanProps[];
}

const PricingPlansSection = ({ plans }: PricingPlansSectionProps) => {
  return (
    <section className="container mx-auto px-4 py-8 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <PricingPlan key={index} plan={plan} />
        ))}
      </div>
    </section>
  );
};

export default PricingPlansSection;
