
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const PricingCTA = () => {
  const navigate = useNavigate();
  
  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="py-12">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Our team is here to help you find the right plan for your organization's sustainability goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" onClick={() => window.location.href = 'mailto:sales@earthkulture.com'}>
              Contact Sales
            </Button>
            <Button size="lg" onClick={() => navigate('/auth')}>
              Start Free Trial
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PricingCTA;
