
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import AnimatedSparkle from '@/components/ai/message-parts/AnimatedSparkle';

const NavigationBar = () => {
  const navigate = useNavigate();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6 px-4 flex items-center justify-between relative z-10"
    >
      <div className="flex items-center space-x-2">
        <div className="relative">
          <motion.div
            animate={{ 
              rotate: [0, 10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" as const }}
          >
            <Leaf className="h-6 w-6 text-primary" />
          </motion.div>
          <AnimatedSparkle className="-top-1 -right-1" size={12} />
        </div>
        <motion.span 
          className="font-bold text-xl bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
        >
          Earth Kulture
        </motion.span>
        <Badge variant="outline" className="ml-2 bg-primary/10 border-primary/20">Beta</Badge>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary" onClick={() => navigate('/about')}>About</Button>
        <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary" onClick={() => navigate('/features')}>Features</Button>
        <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary" onClick={() => navigate('/pricing')}>Pricing</Button>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-primary/20 transition-shadow" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </motion.div>
      </div>
      <Button variant="outline" size="icon" className="md:hidden">
        <div className="flex flex-col gap-1.5">
          <div className="w-5 h-0.5 bg-foreground"></div>
          <div className="w-5 h-0.5 bg-foreground"></div>
          <div className="w-5 h-0.5 bg-foreground"></div>
        </div>
      </Button>
    </motion.nav>
  );
};

export default NavigationBar;
