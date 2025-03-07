
import { ArrowLeft, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PricingHeader = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default PricingHeader;
