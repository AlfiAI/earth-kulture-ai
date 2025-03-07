
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/dashboard/DashboardCard";
import Chart from "@/components/dashboard/Chart";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

const Analytics = () => {
  const [dateRange, setDateRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");

  // Sample data for analytics charts
  const carbonData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 380 },
    { name: "Mar", value: 320 },
    { name: "Apr", value: 310 },
    { name: "May", value: 290 },
    { name: "Jun", value: 260 },
    { name: "Jul", value: 250 },
    { name: "Aug", value: 230 },
  ];

  const esgsData = [
    { name: "Jan", value: 62 },
    { name: "Feb", value: 65 },
    { name: "Mar", value: 68 },
    { name: "Apr", value: 70 },
    { name: "May", value: 72 },
    { name: "Jun", value: 75 },
    { name: "Jul", value: 78 },
    { name: "Aug", value: 81 },
  ];

  const energyData = [
    { name: "Jan", value: 120000 },
    { name: "Feb", value: 118000 },
    { name: "Mar", value: 115000 },
    { name: "Apr", value: 112000 },
    { name: "May", value: 108000 },
    { name: "Jun", value: 105000 },
    { name: "Jul", value: 102000 },
    { name: "Aug", value: 98000 },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed analysis and trends of your sustainability metrics.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <DashboardCard title="Carbon Intensity">
          <div className="flex flex-col space-y-1">
            <p className="text-xs text-muted-foreground">vs Previous Period</p>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">8.2</span>
                <span className="ml-1 text-sm text-muted-foreground">tCO2e/M$</span>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">-12.4%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Lower is better</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="ESG Score">
          <div className="flex flex-col space-y-1">
            <p className="text-xs text-muted-foreground">Overall Performance</p>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">81</span>
                <span className="ml-1 text-sm text-muted-foreground">/100</span>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+3.5%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Top quartile</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Energy Usage">
          <div className="flex flex-col space-y-1">
            <p className="text-xs text-muted-foreground">Annual Consumption</p>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">98,000</span>
                <span className="ml-1 text-sm text-muted-foreground">kWh</span>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">-7.8%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Reduction trend</p>
          </div>
        </DashboardCard>
      </div>

      <Tabs defaultValue="carbon" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="carbon">Carbon Emissions</TabsTrigger>
          <TabsTrigger value="esg">ESG Score</TabsTrigger>
          <TabsTrigger value="energy">Energy Usage</TabsTrigger>
        </TabsList>
        <TabsContent value="carbon">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Carbon Emission Trends</span>
                <div className="flex items-center gap-2">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </CardTitle>
              <CardDescription>
                Total carbon emissions in tCO2e over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Chart 
                  data={carbonData}
                  dataKey="value"
                  xAxisKey="name"
                  type="line"
                  colors={["#16a34a"]}
                  showTabs={false}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="esg">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>ESG Score Progression</span>
                <div className="flex items-center gap-2">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </CardTitle>
              <CardDescription>
                Overall ESG performance score over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Chart 
                  data={esgsData}
                  dataKey="value"
                  xAxisKey="name"
                  type="line"
                  colors={["#3b82f6"]}
                  showTabs={false}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="energy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Energy Consumption</span>
                <div className="flex items-center gap-2">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </CardTitle>
              <CardDescription>
                Total energy consumption in kWh over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Chart 
                  data={energyData}
                  dataKey="value"
                  xAxisKey="name"
                  type="line"
                  colors={["#eab308"]}
                  showTabs={false}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
