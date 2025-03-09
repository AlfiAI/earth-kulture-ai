
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompetitorComparisonCard from './CompetitorComparisonCard';
import BenchmarkSimulator from './BenchmarkSimulator';
import IndustryComparisonCard from './IndustryComparisonCard';
import AIBenchmarkReportCard from './AIBenchmarkReportCard';
import PredictiveInsights from '../predictive/PredictiveInsights';
import { Button } from '@/components/ui/button';
import { Plus, ArrowDownToLine, Users, Building } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndustryType } from '@/services/ai/orchestration/types/agentTypes';

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

  const TeamSelector = () => (
    <div className="mb-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">View Benchmarking Data For</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={dashboardView}
              onValueChange={(value: 'personal' | 'team' | 'organization') => setDashboardView(value)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>My Benchmarks</span>
                  </div>
                </SelectItem>
                <SelectItem value="team">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Team Benchmarks</span>
                  </div>
                </SelectItem>
                <SelectItem value="organization">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>Organization-wide</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {dashboardView === 'team' && (
              <Select defaultValue="sustainability">
                <SelectTrigger className="w-full sm:w-[200px]">
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
                <SelectTrigger className="w-full sm:w-[200px]">
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
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">AI-Powered ESG Benchmarking</h1>
          {userProfile?.industry && (
            <p className="text-muted-foreground">
              Industry: {userProfile.industry.charAt(0).toUpperCase() + userProfile.industry.slice(1)}
            </p>
          )}
        </div>
        <Button onClick={handleGenerateReport} className="flex items-center gap-2">
          <ArrowDownToLine className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {showTeamSelector && <TeamSelector />}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
};

export default BenchmarkingDashboard;
