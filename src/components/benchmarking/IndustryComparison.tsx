
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

// Default industries for benchmarking
const defaultIndustries = [
  { id: 'your_company', name: 'Your Company' },
  { id: 'industry_avg', name: 'Industry Average' },
  { id: 'top_performer', name: 'Top Performer' }
];

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

  // Get display names and units for each category
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'esg':
        return { title: 'ESG Score', unit: 'Points', metricName: 'esg score' };
      case 'carbon':
        return { title: 'Carbon Emissions', unit: 'tCO2e', metricName: 'carbon emissions' };
      case 'compliance':
        return { title: 'Compliance', unit: '%', metricName: 'compliance score' };
      case 'financial':
        return { title: 'Financial Impact', unit: '$', metricName: 'financial impact' };
      default:
        return { title: 'Metrics', unit: 'Value', metricName: 'metrics' };
    }
  };

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
          {['esg', 'carbon', 'compliance', 'financial'].map(category => {
            const { title: categoryTitle, unit, metricName } = getCategoryInfo(category);
            
            return (
              <TabsContent key={category} value={category} className="mt-0 pt-4">
                <BenchmarkHeader 
                  title={categoryTitle} 
                  data={benchmarkData} 
                  isLoading={isLoading} 
                />
                
                <BenchmarkFilters 
                  industry="all" 
                  metric={`${category}_metric`}
                  industries={defaultIndustries}
                />
                
                <BenchmarkChart 
                  chartData={benchmarkData} 
                  isLoading={isLoading}
                  industries={defaultIndustries} 
                />
                
                <BenchmarkFooter 
                  sourceText={`${categoryTitle} industry data`}
                  metricUnit={unit}
                  performanceText="12% better"
                  selectedMetricName={metricName}
                />
              </TabsContent>
            );
          })}
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default IndustryComparison;
