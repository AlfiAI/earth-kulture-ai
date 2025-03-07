
import { Leaf } from 'lucide-react';

const PricingFooter = () => {
  return (
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
  );
};

export default PricingFooter;
