
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Pricing = () => {
  const navigate = useNavigate();

  const pricingPlans = [
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Navigation */}
      <nav className="container mx-auto py-6 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Earth Kulture</span>
        </div>
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </nav>

      {/* Pricing Hero Section */}
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

      {/* Pricing Plans */}
      <section className="container mx-auto px-4 py-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`flex flex-col h-full ${plan.popular ? 'border-primary/50 shadow-lg relative' : 'border-border/40'}`}>
              {plan.popular && (
                <Badge className="absolute -top-2 right-4 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="ml-1 text-sm text-muted-foreground">/ month</span>}
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
                  onClick={() => plan.cta === "Get Started" ? navigate('/auth') : navigate('/contact')}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12 bg-muted/30">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Can I switch plans later?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades will take effect at the end of your billing cycle.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Do you offer a free trial?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, we offer a 14-day free trial on our Professional plan so you can experience the full power of Earth Kulture before committing.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, ACH payments, and wire transfers for annual enterprise plans.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">How do I cancel my subscription?</h3>
              <p className="text-muted-foreground text-sm">
                You can cancel your subscription at any time through your account settings or by contacting our support team. Your plan will remain active until the end of your billing period.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/40">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Leaf className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">Earth Kulture</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2023 Earth Kulture. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
