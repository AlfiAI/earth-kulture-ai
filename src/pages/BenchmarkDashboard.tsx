
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ESGBenchmarkCard from "@/components/external/ESGBenchmarkCard";
import ESGRegulationsList from "@/components/external/ESGRegulationsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BenchmarkDashboard = () => {
  const [activeTab, setActiveTab] = useState("benchmarks");
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Industry Benchmarking</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="benchmarks">ESG Benchmarks</TabsTrigger>
            <TabsTrigger value="regulations">Regulations & Updates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="benchmarks" className="space-y-6">
            <ESGBenchmarkCard />
            
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
                  <p className="text-muted-foreground">
                    Competitor analysis data is being compiled. Check back soon to see
                    how your ESG performance compares to competitors in your industry.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="regulations">
            <ESGRegulationsList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BenchmarkDashboard;
