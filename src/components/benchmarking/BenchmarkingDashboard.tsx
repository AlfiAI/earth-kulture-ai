
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompetitorComparisonCard from './CompetitorComparisonCard';
import BenchmarkSimulator from './BenchmarkSimulator';
import IndustryComparisonCard from './IndustryComparisonCard';
import AIBenchmarkReportCard from './AIBenchmarkReportCard';
import PredictiveInsights from '../predictive/PredictiveInsights';
import { Button } from '@/components/ui/button';
import { Plus, ArrowDownToLine } from 'lucide-react';
import { toast } from 'sonner';

const BenchmarkingDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const handleGenerateReport = () => {
    toast.success("ESG Benchmark report generated and saved to reports");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI-Powered ESG Benchmarking</h1>
        <Button onClick={handleGenerateReport} className="flex items-center gap-2">
          <ArrowDownToLine className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IndustryComparisonCard />
            <AIBenchmarkReportCard />
          </div>
          <PredictiveInsights />
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <CompetitorComparisonCard />
        </TabsContent>

        <TabsContent value="simulation">
          <BenchmarkSimulator />
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PredictiveInsights />
            <AIBenchmarkReportCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BenchmarkingDashboard;
