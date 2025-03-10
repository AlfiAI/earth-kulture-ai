
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompetitorComparisonCard from './CompetitorComparisonCard';
import BenchmarkSimulator from './BenchmarkSimulator';
import IndustryComparisonCard from './IndustryComparisonCard';
import AIBenchmarkReportCard from './AIBenchmarkReportCard';
import PredictiveInsights from '../predictive/PredictiveInsights';
import { Button } from '@/components/ui/button';
import { Plus, ArrowDownToLine, Users, Building, LineChart, BarChart, FlaskConical, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndustryType } from '@/services/ai/orchestration/types/agentTypes';
import { motion } from 'framer-motion';
import AnimatedSparkle from '../ai/message-parts/AnimatedSparkle';

const BenchmarkingDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { userProfile } = useAuth();
  const [dashboardView, setDashboardView] = useState<'personal' | 'team' | 'organization'>('personal');
  const [showTeamSelector, setShowTeamSelector] = useState<boolean>(false);

  useEffect(() => {
    // Set appropriate dashboard view based on user profile
    if (userProfile?.dashboard_preference === 'enterprise') {
      setShowTeamSelector(true);
    }
  }, [userProfile]);

  const handleGenerateReport = () => {
    toast.success(`ESG Benchmark report generated and saved to reports (${dashboardView} view)`);
  };

  const tabVariants = {
    inactive: { opacity: 0.7, y: 0 },
    active: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const TeamSelector = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-br from-card to-card/90 border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            View Benchmarking Data For
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={dashboardView}
              onValueChange={(value: 'personal' | 'team' | 'organization') => setDashboardView(value)}
            >
              <SelectTrigger className="w-full sm:w-[200px] border-primary/20 focus:ring-primary/30">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>My Benchmarks</span>
                  </div>
                </SelectItem>
                <SelectItem value="team">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-cyan-500" />
                    <span>Team Benchmarks</span>
                  </div>
                </SelectItem>
                <SelectItem value="organization">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-emerald-500" />
                    <span>Organization-wide</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {dashboardView === 'team' && (
              <Select defaultValue="sustainability">
                <SelectTrigger className="w-full sm:w-[200px] border-primary/20 focus:ring-primary/30">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sustainability">Sustainability Team</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="facilities">Facilities Management</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {dashboardView === 'organization' && (
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[200px] border-primary/20 focus:ring-primary/30">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="facilities">Facilities</SelectItem>
                  <SelectItem value="supply_chain">Supply Chain</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="relative">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-emerald-500 to-sky-500 bg-clip-text text-transparent">
            AI-Powered ESG Benchmarking
          </h1>
          <AnimatedSparkle className="top-0 -right-8" />
          {userProfile?.industry && (
            <p className="text-muted-foreground">
              Industry: {userProfile.industry.charAt(0).toUpperCase() + userProfile.industry.slice(1)}
            </p>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={handleGenerateReport} 
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-600 shadow-md shadow-primary/10"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Generate Report
          </Button>
        </motion.div>
      </motion.div>

      {showTeamSelector && <TeamSelector />}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-4 mb-8 bg-muted/50 p-1 rounded-xl">
          <motion.div variants={tabVariants} animate={activeTab === 'overview' ? 'active' : 'inactive'}>
            <TabsTrigger 
              value="overview" 
              className="rounded-lg data-[state=active]:bg-gradient-to-r from-primary/10 to-emerald-500/10 data-[state=active]:text-primary"
            >
              <LineChart className="h-4 w-4 mr-1.5" />
              Overview
            </TabsTrigger>
          </motion.div>
          <motion.div variants={tabVariants} animate={activeTab === 'competitors' ? 'active' : 'inactive'}>
            <TabsTrigger 
              value="competitors" 
              className="rounded-lg data-[state=active]:bg-gradient-to-r from-primary/10 to-emerald-500/10 data-[state=active]:text-primary"
            >
              <BarChart className="h-4 w-4 mr-1.5" />
              Competitors
            </TabsTrigger>
          </motion.div>
          <motion.div variants={tabVariants} animate={activeTab === 'simulation' ? 'active' : 'inactive'}>
            <TabsTrigger 
              value="simulation" 
              className="rounded-lg data-[state=active]:bg-gradient-to-r from-primary/10 to-emerald-500/10 data-[state=active]:text-primary"
            >
              <FlaskConical className="h-4 w-4 mr-1.5" />
              Simulation
            </TabsTrigger>
          </motion.div>
          <motion.div variants={tabVariants} animate={activeTab === 'insights' ? 'active' : 'inactive'}>
            <TabsTrigger 
              value="insights" 
              className="rounded-lg data-[state=active]:bg-gradient-to-r from-primary/10 to-emerald-500/10 data-[state=active]:text-primary"
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              AI Insights
            </TabsTrigger>
          </motion.div>
        </TabsList>

        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IndustryComparisonCard industryContext={userProfile?.industry as IndustryType} />
              <AIBenchmarkReportCard dashboardView={dashboardView} />
            </div>
            <PredictiveInsights />
          </TabsContent>

          <TabsContent value="competitors" className="space-y-6">
            <CompetitorComparisonCard industryContext={userProfile?.industry as IndustryType} />
          </TabsContent>

          <TabsContent value="simulation">
            <BenchmarkSimulator industryContext={userProfile?.industry as IndustryType} />
          </TabsContent>

          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PredictiveInsights />
              <AIBenchmarkReportCard dashboardView={dashboardView} />
            </div>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default BenchmarkingDashboard;
