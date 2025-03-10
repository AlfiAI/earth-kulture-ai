
import { LineChart, Shield, Bot } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  return (
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
  );
};

export default FeaturesSection;
