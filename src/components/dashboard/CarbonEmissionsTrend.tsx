
import React from 'react';
import { Filter, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Chart from "./Chart";
import DashboardCard from "./DashboardCard";

// Sample carbon data
const carbonData = [
  { name: 'Jan', 'Scope 1': 240, 'Scope 2': 139, 'Scope 3': 980 },
  { name: 'Feb', 'Scope 1': 230, 'Scope 2': 168, 'Scope 3': 940 },
  { name: 'Mar', 'Scope 1': 310, 'Scope 2': 178, 'Scope 3': 1100 },
  { name: 'Apr', 'Scope 1': 340, 'Scope 2': 239, 'Scope 3': 1200 },
  { name: 'May', 'Scope 1': 280, 'Scope 2': 249, 'Scope 3': 1180 },
  { name: 'Jun', 'Scope 1': 220, 'Scope 2': 184, 'Scope 3': 1050 },
  { name: 'Jul', 'Scope 1': 250, 'Scope 2': 162, 'Scope 3': 950 },
  { name: 'Aug', 'Scope 1': 210, 'Scope 2': 142, 'Scope 3': 920 }
];

const CarbonEmissionsTrend = () => {
  return (
    <DashboardCard
      title="Carbon Emissions Trend"
      description="Last 8 months by scope"
      contentClassName="p-0"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            Total emissions: <span className="font-medium text-foreground">9,540 tCO2e</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span className="text-xs">Filter</span>
            </Button>
            
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Download className="h-3.5 w-3.5" />
              <span className="text-xs">Export</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="line">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="bar">Bar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="line" className="pt-2">
            <Chart
              data={carbonData}
              type="line"
              dataKey="Scope 1"
              secondaryDataKey="Scope 2"
              height={300}
            />
          </TabsContent>
          
          <TabsContent value="bar" className="pt-2">
            <Chart
              data={carbonData}
              type="bar"
              dataKey="Scope 1"
              secondaryDataKey="Scope 2"
              height={300}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardCard>
  );
};

export default CarbonEmissionsTrend;
