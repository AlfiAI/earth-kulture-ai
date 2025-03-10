
import { NavigationBar, HeroSection, FeaturesSection, CTASection, FooterSection, BackgroundEffects } from '@/components/landing';
import SimpleChat from '@/components/chat/SimpleChat';

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-background via-background/95 to-primary/5">
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
    </div>
  );
};

export default Landing;
