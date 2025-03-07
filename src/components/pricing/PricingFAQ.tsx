
import { Card, CardContent } from '@/components/ui/card';
import { FAQItemProps } from './types';

interface PricingFAQProps {
  faqs: FAQItemProps[];
}

const PricingFAQ = ({ faqs }: PricingFAQProps) => {
  return (
    <section className="container mx-auto px-4 py-12 bg-muted/30">
      <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <Card key={index} className="bg-card/50 border-primary/10">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground text-sm">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PricingFAQ;
