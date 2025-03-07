
import React from 'react';
import { ArrowDownRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import DashboardCard from "./DashboardCard";

const CarbonFootprint = () => {
  return (
    <DashboardCard
      title="Carbon Footprint"
      description="Monthly comparison"
      className="col-span-1"
    >
      <div className="flex flex-col space-y-3 pt-2">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Scope 1</span>
              <span className="text-xs text-muted-foreground">210 tCO2e</span>
            </div>
            <Progress value={21} className="h-2" />
          </div>
          <div className="text-xs flex items-center gap-1 text-green-600">
            <ArrowDownRight className="h-3 w-3" />
            <span>5%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Scope 2</span>
              <span className="text-xs text-muted-foreground">142 tCO2e</span>
            </div>
            <Progress value={14} className="h-2" />
          </div>
          <div className="text-xs flex items-center gap-1 text-green-600">
            <ArrowDownRight className="h-3 w-3" />
            <span>12%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Scope 3</span>
              <span className="text-xs text-muted-foreground">920 tCO2e</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
          <div className="text-xs flex items-center gap-1 text-green-600">
            <ArrowDownRight className="h-3 w-3" />
            <span>3%</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 text-sm">
          <div>
            <span className="font-medium">1,272</span>
            <span className="text-xs text-muted-foreground ml-1">tCO2e Total</span>
          </div>
          <div className="flex items-center text-green-600 text-xs font-medium">
            <ArrowDownRight className="h-3 w-3 mr-1" />
            <span>5.2% vs last month</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default CarbonFootprint;
