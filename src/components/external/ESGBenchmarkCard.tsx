
import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Award, TrendingDown, TrendingUp, AlertTriangle, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Updated benchmark data with historical tracking
const benchmarkData = [
  { year: 2019, company: 40, industry: 70, topPerformer: 30 },
  { year: 2020, company: 35, industry: 65, topPerformer: 25 },
  { year: 2021, company: 30, industry: 60, topPerformer: 20 },
  { year: 2022, company: 25, industry: 55, topPerformer: 18 },
  { year: 2023, company: 20, industry: 50, topPerformer: 15 },
];

// Sample industry comparison data
const industryComparisonData = [
  { industry: "Energy", average: 65, yourCompany: 30, bestInClass: 18 },
  { industry: "Materials", average: 48, yourCompany: 35, bestInClass: 22 },
  { industry: "Industrials", average: 42, yourCompany: 28, bestInClass: 15 },
  { industry: "Consumer", average: 38, yourCompany: 25, bestInClass: 16 },
  { industry: "Healthcare", average: 35, yourCompany: 22, bestInClass: 12 },
  { industry: "Tech", average: 30, yourCompany: 18, bestInClass: 10 },
];

const ESGBenchmarkCard = () => {
  const [activeTab, setActiveTab] = useState("carbon");
  const [dataView, setDataView] = useState("historical");
  const [isLoading, setIsLoading] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [industry, setIndustry] = useState("all");
  const [benchmark, setBenchmark] = useState("ghg");
  
  const refreshData = useCallback(() => {
    setIsLoading(true);
    // Simulate API call to refresh data
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Benchmark data refreshed");
    }, 1500);
  }, []);
  
  // AI-generated insights based on the data
  const aiInsights = {
    carbon: "Your company's carbon intensity has improved by 50% since 2019, outperforming your industry average by 60%. Continue focusing on renewable energy adoption to maintain this leadership position.",
    water: "Water usage efficiency has improved by 15% year-over-year, but remains 5% behind industry leaders. Consider implementing closed-loop water systems to close this gap.",
    waste: "Your waste diversion rate has reached 80%, exceeding industry average of 65%. This places you among the top 10% of performers in your sector."
  };
  
  // Trend calculation
  const calculateTrend = () => {
    const firstYear = benchmarkData[0];
    const lastYear = benchmarkData[benchmarkData.length - 1];
    const companyChange = (lastYear.company - firstYear.company) / firstYear.company * 100;
    const industryChange = (lastYear.industry - firstYear.industry) / firstYear.industry * 100;
    
    return {
      company: companyChange,
      industry: industryChange,
      differential: companyChange - industryChange
    };
  };
  
  const trend = calculateTrend();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-xl">ESG Performance Benchmarks</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Updating...' : 'Refresh Data'}
          </Button>
        </div>
        <CardDescription>
          Compare your performance against industry benchmarks and top performers
        </CardDescription>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 space-y-2 md:space-y-0 md:space-x-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-ai-insights">AI Insights</Label>
            <Switch 
              id="show-ai-insights" 
              checked={showAIInsights} 
              onCheckedChange={setShowAIInsights} 
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="materials">Materials</SelectItem>
                <SelectItem value="industrials">Industrials</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={benchmark} onValueChange={setBenchmark}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Benchmark" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ghg">GHG Emissions</SelectItem>
                <SelectItem value="water">Water Usage</SelectItem>
                <SelectItem value="waste">Waste</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full mb-2">
            <TabsTrigger value="carbon">Carbon</TabsTrigger>
            <TabsTrigger value="water">Water</TabsTrigger>
            <TabsTrigger value="waste">Waste</TabsTrigger>
          </TabsList>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Button 
                variant={dataView === "historical" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setDataView("historical")}
              >
                Historical
              </Button>
              <Button 
                variant={dataView === "comparison" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setDataView("comparison")}
              >
                Industry Comparison
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-80 w-full flex items-center justify-center">
              <Skeleton className="h-4/5 w-full" />
            </div>
          ) : (
            <>
              <TabsContent value="carbon" className="space-y-4">
                {dataView === "historical" ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={benchmarkData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 25,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="company"
                          name="Your Company"
                          stroke="#10b981"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="industry" 
                          name="Industry Average" 
                          stroke="#6366f1" 
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="topPerformer" 
                          name="Top Performer" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={industryComparisonData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 25,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="industry" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average" name="Industry Average" fill="#6366f1" />
                        <Bar dataKey="yourCompany" name="Your Company" fill="#10b981" />
                        <Bar dataKey="bestInClass" name="Best-in-Class" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                {showAIInsights && (
                  <Alert>
                    <div className="flex items-start">
                      {trend.differential < 0 ? (
                        <TrendingDown className="h-5 w-5 text-destructive" />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      )}
                      <div className="ml-2">
                        <AlertTitle className="mb-1">AI-Generated Insight</AlertTitle>
                        <AlertDescription>
                          {aiInsights.carbon}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="water" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={benchmarkData.map(item => ({
                        year: item.year,
                        company: item.company * 1.2, // Just different data for example
                        industry: item.industry * 0.9,
                        topPerformer: item.topPerformer * 1.1
                      }))}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 25,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="company"
                        name="Your Company"
                        stroke="#10b981"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="industry" 
                        name="Industry Average" 
                        stroke="#6366f1" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="topPerformer" 
                        name="Top Performer" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {showAIInsights && (
                  <Alert>
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <div className="ml-2">
                      <AlertTitle className="mb-1">AI-Generated Insight</AlertTitle>
                      <AlertDescription>
                        {aiInsights.water}
                      </AlertDescription>
                    </div>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="waste" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={benchmarkData.map(item => ({
                        year: item.year,
                        company: item.company * 0.8, // Just different data for example
                        industry: item.industry * 1.1,
                        topPerformer: item.topPerformer * 0.7
                      }))}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 25,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="company"
                        name="Your Company"
                        stroke="#10b981"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="industry" 
                        name="Industry Average" 
                        stroke="#6366f1" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="topPerformer" 
                        name="Top Performer" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {showAIInsights && (
                  <Alert>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div className="ml-2">
                      <AlertTitle className="mb-1">AI-Generated Insight</AlertTitle>
                      <AlertDescription>
                        {aiInsights.waste}
                      </AlertDescription>
                    </div>
                  </Alert>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 text-sm">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Source: Industry reports, ESG Rating Agencies, 2023</span>
          <span className="text-muted-foreground">Unit: tCO2e/$M revenue</span>
        </div>
        
        <div className="text-sm">
          <span className="inline-flex items-center font-semibold text-green-600">
            <TrendingDown className="h-4 w-4 mr-1" />
            {Math.abs(trend.differential).toFixed(0)}% better than industry average
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ESGBenchmarkCard;
