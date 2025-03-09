
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Globe } from 'lucide-react';
import ESGRegulationsList from "@/components/external/ESGRegulationsList";
import ESGBenchmarkCard from "@/components/external/ESGBenchmarkCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ExternalData = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto p-4 lg:p-6 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <Globe className="h-6 w-6 mr-2" />
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
          >
            View Industry Benchmarks
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ESGRegulationsList />
          </div>
        </div>
        
        <div className="mb-6">
          <ESGBenchmarkCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExternalData;
