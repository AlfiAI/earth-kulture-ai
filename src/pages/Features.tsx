
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, LineChart, Bot, Database, Shield, BarChart, Zap, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Features = () => {
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

      {/* Features Hero Section */}
      <section className="container mx-auto px-4 pt-12 pb-16 md:pt-24 md:pb-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mb-6">
          Powerful <span className="text-primary">Features</span> for Sustainability Leaders
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-10">
          Earth Kulture provides comprehensive tools to track, analyze, and improve your environmental impact with data-driven insights and AI.
        </p>
      </section>

      {/* Main Features */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-card/50 border-primary/10 transition-all hover:shadow-md">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Carbon Analytics</h3>
              <p className="text-muted-foreground">
                Track and analyze your carbon footprint across scopes 1, 2, and 3 with detailed insights and visualizations.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Automated emissions calculations
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Interactive dashboards and reports
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Historical trend analysis
                </li>
              </ul>
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
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Support for GRI, SASB, TCFD standards
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Regulatory compliance monitoring
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Automated reporting templates
                </li>
              </ul>
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
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Predictive emission trend modeling
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Anomaly detection and alerts
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Natural language sustainability Q&A
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Features */}
      <section className="container mx-auto px-4 py-12 bg-muted/30">
        <h2 className="text-3xl font-bold mb-8 text-center">Additional Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Data Integration</h3>
              <p className="text-muted-foreground text-sm">
                Connect with your existing systems through our flexible API and automated data imports.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <BarChart className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ESG Reporting</h3>
              <p className="text-muted-foreground text-sm">
                Generate comprehensive ESG reports aligned with global standards and investor requirements.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Goal Setting</h3>
              <p className="text-muted-foreground text-sm">
                Set and track sustainability goals with automated progress monitoring and alerts.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="pt-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <CircleDollarSign className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ROI Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Calculate the financial impact of sustainability initiatives with our ROI modeling tools.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
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

export default Features;
