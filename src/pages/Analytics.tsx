
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
        <DashboardCard
          title="Carbon Intensity"
          subtitle="vs Previous Period"
          value="8.2"
          unit="tCO2e/M$"
          trend={-12.4}
          trendIcon={TrendingDown}
          trendColor="text-green-600"
          trendText="Lower is better"
        />
        <DashboardCard
          title="ESG Score"
          subtitle="Overall Performance"
          value="81"
          unit="/100"
          trend={3.5}
          trendIcon={TrendingUp}
          trendColor="text-green-600"
          trendText="Top quartile"
        />
        <DashboardCard
          title="Energy Usage"
          subtitle="Annual Consumption"
          value="98,000"
          unit="kWh"
          trend={-7.8}
          trendIcon={TrendingDown}
          trendColor="text-green-600"
          trendText="Reduction trend"
        />
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
                  xAxisKey="name"
                  yAxisKey="value"
                  strokeColor="#16a34a"
                  title="Carbon Emissions (tCO2e)"
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
                  xAxisKey="name"
                  yAxisKey="value"
                  strokeColor="#3b82f6"
                  title="ESG Score (out of 100)"
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
                  xAxisKey="name"
                  yAxisKey="value"
                  strokeColor="#eab308"
                  title="Energy Usage (kWh)"
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
