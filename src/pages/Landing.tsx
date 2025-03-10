
import { useNavigate } from 'react-router-dom';
import { Bot, ArrowRight, LineChart, Shield, Leaf, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import SimpleChat from '@/components/chat/SimpleChat';
import AnimatedSparkle from '@/components/ai/message-parts/AnimatedSparkle';

const Landing = () => {
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
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-background via-background/95 to-primary/5">
      {/* Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-primary/10 to-cyan-500/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" as const }}
        />
        <motion.div 
          className="absolute bottom-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-emerald-500/10 to-primary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" as const, delay: 1 }}
        />
      </div>

      {/* Navigation */}
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
              Sign In <ArrowRight className="ml-2 h-4 w-4" />
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

      {/* Hero Section */}
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

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="container mx-auto px-4 py-20 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="h-full bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-primary/10 overflow-hidden shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-80"></div>
              <CardContent className="pt-6 h-full">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5 border border-primary/10">
                  <LineChart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Carbon Analytics</h3>
                <p className="text-muted-foreground">
                  Track and analyze your carbon footprint across scopes 1, 2, and 3 with detailed insights and visualizations.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="h-full bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-primary/10 overflow-hidden shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-80"></div>
              <CardContent className="pt-6 h-full">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5 border border-primary/10">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Compliance Tracking</h3>
                <p className="text-muted-foreground">
                  Stay compliant with global sustainability frameworks and reporting requirements with automated updates.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="h-full bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-primary/10 overflow-hidden shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-80"></div>
              <CardContent className="pt-6 h-full">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5 border border-primary/10">
                  <Bot className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Insights</h3>
                <p className="text-muted-foreground">
                  Get intelligent recommendations and predictions to optimize your sustainability efforts with our AI assistant.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
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
                  onClick={() => navigate('/auth')}
                >
                  Get Started Today <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/40 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" as const }}
              className="mr-2"
            >
              <Leaf className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="font-medium bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Earth Kulture</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2023 Earth Kulture. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Add SimpleChat component */}
      <SimpleChat />
    </div>
  );
};

export default Landing;
