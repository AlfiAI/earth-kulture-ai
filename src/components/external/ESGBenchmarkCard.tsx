
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BenchmarkChart from "./benchmark/BenchmarkChart";
import BenchmarkFilters from "./benchmark/BenchmarkFilters";
import BenchmarkHeader from "./benchmark/BenchmarkHeader";
import BenchmarkFooter from "./benchmark/BenchmarkFooter";
import { useBenchmarkData } from "./benchmark/useBenchmarkData";

const ESGBenchmarkCard = () => {
  const {
    isLoading,
    industry,
    setIndustry,
    chartData,
    selectedMetric,
    setSelectedMetric,
    metrics,
    industries
  } = useBenchmarkData();
  
  const selectedMetricObj = metrics.find(m => m.id === selectedMetric);
  
  return (
    <Card>
      <CardHeader>
        <BenchmarkHeader 
          title="ESG Industry Benchmarks" 
          description="Compare your performance against industry standards" 
        />
        
        <BenchmarkFilters 
          industries={industries}
          metrics={metrics}
          selectedIndustry={industry}
          selectedMetric={selectedMetric}
          setIndustry={setIndustry}
          setSelectedMetric={setSelectedMetric}
        />
      </CardHeader>
      
      <CardContent>
        <BenchmarkChart 
          chartData={chartData}
          industries={industries}
          isLoading={isLoading}
        />
        
        <BenchmarkFooter 
          sourceText="Source: Industry sustainability reports and public disclosures"
          metricUnit={selectedMetricObj?.unit || 'Value'}
          performanceText="12% better"
          selectedMetricName={selectedMetricObj?.name.toLowerCase() || ''}
        />
      </CardContent>
    </Card>
  );
};

export default ESGBenchmarkCard;
