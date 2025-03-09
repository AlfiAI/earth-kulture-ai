
import { Globe } from 'lucide-react';
import ESGRegulationsList from "@/components/external/ESGRegulationsList";
import ESGBenchmarkCard from "@/components/external/ESGBenchmarkCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import InsightsLayout from "@/components/insights/InsightsLayout";

const ExternalData = () => {
  const navigate = useNavigate();

  return (
    <InsightsLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <Globe className="h-6 w-6 mr-2 flex-shrink-0" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">External ESG Data</h1>
            <p className="text-muted-foreground">
              Regulatory updates, benchmarks, and industry data
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/benchmark')}
          className="whitespace-nowrap"
        >
          View Industry Benchmarks
        </Button>
      </div>
      
      <div className="space-y-6">
        <ESGRegulationsList />
        <ESGBenchmarkCard />
      </div>
    </InsightsLayout>
  );
};

export default ExternalData;
