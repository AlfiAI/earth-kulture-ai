
import { Button } from '@/components/ui/button';

const PricingHero = () => {
  return (
    <section className="container mx-auto px-4 pt-12 pb-16 md:pt-24 md:pb-24 flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mb-6">
        Simple, Transparent <span className="text-primary">Pricing</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-6">
        Choose the plan that fits your organization's sustainability goals and scale as you grow.
      </p>
      <div className="flex items-center gap-2 mt-4">
        <span className="text-sm text-muted-foreground">Monthly</span>
        <Button variant="outline" size="sm" className="rounded-full px-3 h-7">
          Save 20%
        </Button>
        <span className="text-sm font-medium">Annual</span>
      </div>
    </section>
  );
};

export default PricingHero;
