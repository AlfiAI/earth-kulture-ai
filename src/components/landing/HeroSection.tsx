
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import AnimatedSparkle from '@/components/ai/message-parts/AnimatedSparkle';

const HeroSection = () => {
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="container mx-auto px-4 pt-10 pb-20 md:pt-16 md:pb-28 flex flex-col items-center text-center relative z-10">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-3xl mx-auto"
      >
        <motion.div variants={fadeInUp} className="mb-4">
          <Badge variant="outline" className="px-4 py-1.5 bg-gradient-to-r from-primary/10 to-cyan-500/10 border-primary/20 backdrop-blur-sm">
            <span className="text-primary font-medium">Sustainable Business Intelligence</span>
          </Badge>
        </motion.div>
        <motion.h1 
          variants={fadeInUp}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight"
        >
          Make your business{' '}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              carbon intelligent
            </span>
            <motion.span 
              className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 rounded-md -z-10"
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 1, delay: 1 }}
            />
          </span>
        </motion.h1>
        <motion.p 
          variants={fadeInUp}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Earth Kulture helps sustainability leaders track, analyze, and improve their environmental 
          impact with AI-powered tools and real-time data.
        </motion.p>
        <motion.div 
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto"
        >
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full"
          >
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-primary/20"
              onClick={() => navigate('/auth')}
            >
              Get Started
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full"
          >
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              onClick={() => navigate('/demo')}
            >
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
