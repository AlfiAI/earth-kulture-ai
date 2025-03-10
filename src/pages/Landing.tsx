
import { motion } from 'framer-motion';
import { 
  NavigationBar, 
  HeroSection, 
  FeaturesSection, 
  CTASection, 
  FooterSection, 
  BackgroundEffects 
} from '@/components/landing';
import SimpleChat from '@/components/chat/SimpleChat';
import { pageTransitionVariants } from '@/styles/animations';

const Landing = () => {
  return (
    <motion.div 
      className="min-h-screen overflow-hidden bg-gradient-to-b from-background via-background/95 to-primary/5"
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Decorative Blobs */}
      <BackgroundEffects />

      {/* Navigation */}
      <NavigationBar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <FooterSection />

      {/* Add SimpleChat component */}
      <SimpleChat />
    </motion.div>
  );
};

export default Landing;
