
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartTab from "./ChartTab";
import { carbonData, esgsData, energyData } from "@/data/analyticsData";

const ChartTabsSection = () => {
  const [dateRange, setDateRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");

  return (
    <Tabs defaultValue="carbon" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="carbon">Carbon Emissions</TabsTrigger>
        <TabsTrigger value="esg">ESG Score</TabsTrigger>
        <TabsTrigger value="energy">Energy Usage</TabsTrigger>
      </TabsList>
      
      <TabsContent value="carbon">
        <ChartTab 
          title="Carbon Emission Trends"
          description="Total carbon emissions in tCO2e over time"
          data={carbonData}
          dateRange={dateRange}
          setDateRange={setDateRange}
          colors={["#16a34a"]}
        />
      </TabsContent>
      
      <TabsContent value="esg">
        <ChartTab 
          title="ESG Score Progression"
          description="Overall ESG performance score over time"
          data={esgsData}
          dateRange={dateRange}
          setDateRange={setDateRange}
          colors={["#3b82f6"]}
        />
      </TabsContent>
      
      <TabsContent value="energy">
        <ChartTab 
          title="Energy Consumption"
          description="Total energy consumption in kWh over time"
          data={energyData}
          dateRange={dateRange}
          setDateRange={setDateRange}
          colors={["#eab308"]}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ChartTabsSection;
