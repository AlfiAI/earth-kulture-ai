
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BenchmarkChart from "@/components/external/benchmark/BenchmarkChart";
import BenchmarkFilters from "@/components/external/benchmark/BenchmarkFilters";
import BenchmarkHeader from "@/components/external/benchmark/BenchmarkHeader";
import BenchmarkFooter from "@/components/external/benchmark/BenchmarkFooter";
import { benchmarkingService } from '@/services/benchmarking';

interface IndustryComparisonProps {
  title?: string;
  description?: string;
}

const IndustryComparison = ({ 
  title = "Industry ESG Comparison", 
  description = "Compare your ESG performance against industry benchmarks"
}: IndustryComparisonProps) => {
  const [activeTab, setActiveTab] = useState("esg");
  const [benchmarkData, setBenchmarkData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await benchmarkingService.getPredictions(activeTab as any);
        setBenchmarkData(data);
      } catch (error) {
        console.error(`Error fetching ${activeTab} benchmark data:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      
      <Tabs defaultValue="esg" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="esg">ESG Score</TabsTrigger>
            <TabsTrigger value="carbon">Carbon</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent>
          <TabsContent value="esg" className="mt-0 pt-4">
            <BenchmarkHeader title="ESG Score" data={benchmarkData} isLoading={isLoading} />
            <BenchmarkFilters industry="all" metric="esg_score" />
            <BenchmarkChart chartData={benchmarkData} isLoading={isLoading} />
            <BenchmarkFooter sourceText="ESG industry data" />
          </TabsContent>
          
          <TabsContent value="carbon" className="mt-0 pt-4">
            <BenchmarkHeader title="Carbon Emissions" data={benchmarkData} isLoading={isLoading} />
            <BenchmarkFilters industry="all" metric="carbon_emissions" />
            <BenchmarkChart chartData={benchmarkData} isLoading={isLoading} />
            <BenchmarkFooter sourceText="Carbon emissions data" />
          </TabsContent>
          
          <TabsContent value="compliance" className="mt-0 pt-4">
            <BenchmarkHeader title="Compliance" data={benchmarkData} isLoading={isLoading} />
            <BenchmarkFilters industry="all" metric="compliance_score" />
            <BenchmarkChart chartData={benchmarkData} isLoading={isLoading} />
            <BenchmarkFooter sourceText="Compliance data" />
          </TabsContent>
          
          <TabsContent value="financial" className="mt-0 pt-4">
            <BenchmarkHeader title="Financial Impact" data={benchmarkData} isLoading={isLoading} />
            <BenchmarkFilters industry="all" metric="financial_impact" />
            <BenchmarkChart chartData={benchmarkData} isLoading={isLoading} />
            <BenchmarkFooter sourceText="Financial impact data" />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default IndustryComparison;
