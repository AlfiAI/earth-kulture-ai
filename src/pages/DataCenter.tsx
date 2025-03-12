
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ExternalLink } from "lucide-react";
import DataHeader from "@/components/data/DataHeader";
import DataSourceCard from "@/components/data/DataSourceCard";
import DataValidation from "@/components/data/DataValidation";
import DatabaseOptimizationStatus from "@/components/data/DatabaseOptimizationStatus";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DataCenter = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="px-3 py-4 md:px-4 md:py-6 max-w-7xl mx-auto pb-24 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6">
          <DataHeader 
            title="Data Management" 
            subtitle="AI-powered data processing for ESG & carbon tracking" 
          />
          <Button 
            variant="outline" 
            className="mt-3 sm:mt-0 w-full sm:w-auto whitespace-nowrap"
            onClick={() => navigate('/external-data')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            External Data
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:gap-6 mb-4 md:mb-6">
          <DataSourceCard />
          <DataValidation />
        </div>

        <div className="mb-4 md:mb-6">
          <DatabaseOptimizationStatus />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DataCenter;
