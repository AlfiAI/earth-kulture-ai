
import { ChevronRight, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();
  
  const pulseAnimation = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="container mx-auto px-4 py-16 text-center relative z-10"
    >
      <motion.div variants={pulseAnimation} initial="initial" animate="animate">
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-cyan-500/10 border-primary/20 backdrop-blur-sm shadow-xl overflow-hidden relative">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-primary/10 to-cyan-500/10 opacity-30"
            animate={{ 
              x: ["-100%", "100%"],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              repeatType: "loop" as const 
            }}
          />
          <CardContent className="py-12 px-6 md:px-12 relative z-10">
            <div className="mb-1">
              <Sparkles className="h-5 w-5 text-primary mx-auto" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ready to make your business sustainable?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join hundreds of forward-thinking companies using Earth Kulture to track, manage, and improve their environmental impact.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-primary/20"
                onClick={() => navigate('/dashboard')}
              >
                Go To Dashboard <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
};

export default CTASection;
