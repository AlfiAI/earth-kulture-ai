
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Users, Globe, Award, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const navigate = useNavigate();

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

      {/* About Hero Section */}
      <section className="container mx-auto px-4 pt-12 pb-24 md:pt-24 md:pb-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mb-6">
          About <span className="text-primary">Earth Kulture</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-10">
          Founded in 2020, Earth Kulture is on a mission to empower businesses to lead the way toward a sustainable future through data-driven insights and carbon intelligence.
        </p>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg mb-4">
            Earth Kulture was founded by a team of environmental scientists, data engineers, and business leaders united by a common goal: to make sustainability actionable for businesses of all sizes.
          </p>
          <p className="text-lg mb-4">
            We recognized that while many organizations wanted to reduce their environmental impact, they lacked the tools to effectively measure, analyze, and improve their sustainability efforts.
          </p>
          <p className="text-lg mb-4">
            By combining cutting-edge AI technology with environmental expertise, we've created a platform that transforms complex sustainability data into clear insights and actionable recommendations.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="container mx-auto px-4 py-12 bg-muted/30">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Environmental Impact</h3>
              <p className="text-muted-foreground">
                We believe businesses can be powerful forces for positive environmental change when equipped with the right tools and insights.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Integrity</h3>
              <p className="text-muted-foreground">
                Our insights are built on accurate, transparent data, because we understand that meaningful sustainability efforts require trustworthy information.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously push the boundaries of what's possible with AI and data science to provide ever-improving tools for sustainability leaders.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Emma Rodriguez</h3>
              <p className="text-primary mb-2">CEO & Co-Founder</p>
              <p className="text-muted-foreground">
                Environmental scientist with 15 years of experience in climate policy and corporate sustainability.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-1">David Chen</h3>
              <p className="text-primary mb-2">CTO & Co-Founder</p>
              <p className="text-muted-foreground">
                AI researcher and data scientist specializing in environmental applications of machine learning.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Sarah Johnson</h3>
              <p className="text-primary mb-2">Chief Sustainability Officer</p>
              <p className="text-muted-foreground">
                Former sustainability consultant with expertise in ESG reporting and carbon accounting frameworks.
              </p>
            </CardContent>
          </Card>
        </div>
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

export default About;
