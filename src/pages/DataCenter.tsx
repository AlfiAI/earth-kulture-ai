
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
      <div className="container max-w-7xl mx-auto p-4 lg:p-6 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <DataHeader 
            title="Data Management" 
            subtitle="AI-powered data processing for ESG & carbon tracking" 
          />
          <Button 
            variant="outline" 
            className="mt-2 sm:mt-0"
            onClick={() => navigate('/external-data')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            External Data Sources
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DataSourceCard />
          <DataValidation />
        </div>

        <div className="mb-6">
          <DatabaseOptimizationStatus />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DataCenter;
