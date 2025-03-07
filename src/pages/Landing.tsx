
import { useNavigate } from 'react-router-dom';
import { Bot, ArrowRight, LineChart, Shield, Leaf } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Navigation */}
      <nav className="container mx-auto py-6 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Earth Kulture</span>
          <Badge variant="outline" className="ml-2 bg-primary/10">Beta</Badge>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/about')}>About</Button>
          <Button variant="ghost" onClick={() => navigate('/features')}>Features</Button>
          <Button variant="ghost" onClick={() => navigate('/pricing')}>Pricing</Button>
          <Button className="hidden sm:flex" onClick={() => navigate('/auth')}>
            Sign In <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 pb-24 md:pt-24 md:pb-32 flex flex-col items-center text-center">
        <Badge variant="outline" className="mb-4 px-3 py-1 bg-primary/10 text-primary">
          Sustainable Business Intelligence
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mb-6">
          Make your business <span className="text-primary">carbon intelligent</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-10">
          Earth Kulture helps sustainability leaders track, analyze, and improve their environmental impact with AI-powered tools and real-time data.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button size="lg" className="w-full" onClick={() => navigate('/auth')}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="w-full" onClick={() => navigate('/demo')}>
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-card/50 border-primary/10 transition-all hover:shadow-md">
          <CardContent className="pt-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Carbon Analytics</h3>
            <p className="text-muted-foreground">
              Track and analyze your carbon footprint across scopes 1, 2, and 3 with detailed insights and visualizations.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-primary/10 transition-all hover:shadow-md">
          <CardContent className="pt-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Compliance Tracking</h3>
            <p className="text-muted-foreground">
              Stay compliant with global sustainability frameworks and reporting requirements with automated updates.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-primary/10 transition-all hover:shadow-md">
          <CardContent className="pt-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <p className="text-muted-foreground">
              Get intelligent recommendations and predictions to optimize your sustainability efforts with our AI assistant.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to make your business sustainable?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join hundreds of forward-thinking companies using Earth Kulture to track, manage, and improve their environmental impact.
            </p>
            <Button size="lg" onClick={() => navigate('/auth')}>
              Get Started Today
            </Button>
          </CardContent>
        </Card>
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

export default Landing;
