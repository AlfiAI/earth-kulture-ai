
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart3, Award, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { externalDataService, ESGBenchmark } from "@/services/external/externalDataService";

const ESGBenchmarkCard = () => {
  const [benchmarks, setBenchmarks] = useState<ESGBenchmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [industry, setIndustry] = useState("all");
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedMetric, setSelectedMetric] = useState("carbon_intensity");
  
  const metrics = [
    { id: "carbon_intensity", name: "Carbon Intensity", unit: "tCO2e/$M" },
    { id: "energy_consumption", name: "Energy Consumption", unit: "GWh" },
    { id: "water_usage", name: "Water Usage", unit: "m³" },
    { id: "waste_recycling", name: "Waste Recycling", unit: "%" }
  ];
  
  const industries = [
    { id: "all", name: "All Industries" },
    { id: "technology", name: "Technology" },
    { id: "manufacturing", name: "Manufacturing" },
    { id: "financial", name: "Financial Services" },
    { id: "energy", name: "Energy" },
    { id: "retail", name: "Retail" }
  ];
  
  useEffect(() => {
    fetchBenchmarks();
  }, [industry]);
  
  useEffect(() => {
    if (benchmarks.length > 0) {
      prepareChartData();
    } else {
      const demoData = getDemoBenchmarks();
      setBenchmarks(demoData);
      prepareChartDataFromDemoData(demoData);
    }
  }, [benchmarks, selectedMetric]);
  
  const fetchBenchmarks = async () => {
    setIsLoading(true);
    
    try {
      const industryFilter = industry !== "all" ? industry : undefined;
      const data = await externalDataService.getESGBenchmarks(industryFilter);
      
      if (data && data.length > 0) {
        setBenchmarks(data);
      } else {
        setBenchmarks(getDemoBenchmarks());
      }
    } catch (error) {
      console.error("Error fetching benchmarks:", error);
      setBenchmarks(getDemoBenchmarks());
    } finally {
      setIsLoading(false);
    }
  };
  
  const prepareChartData = () => {
    const grouped: Record<string, Record<string, any>> = {};
    
    // Group by year and industry
    benchmarks.forEach(benchmark => {
      const year = benchmark.year?.toString() || '2023';
      if (!grouped[year]) {
        grouped[year] = {};
      }
      
      grouped[year][benchmark.industry] = benchmark.benchmark_value;
    });
    
    // Convert grouped data to chart format
    const chartData = Object.keys(grouped).map(year => {
      return {
        year,
        ...grouped[year]
      };
    });
    
    // Sort by year
    chartData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    
    setChartData(chartData);
  };
  
  const prepareChartDataFromDemoData = (demoData: ESGBenchmark[]) => {
    // For demo data, we'll create a simpler chart
    const years = ['2019', '2020', '2021', '2022', '2023'];
    const industries = ['technology', 'manufacturing', 'financial', 'energy', 'retail'];
    
    const chartData = years.map(year => {
      const dataPoint: Record<string, any> = { year };
      
      industries.forEach(industry => {
        // Find a matching benchmark or generate a value
        const benchmark = demoData.find(b => b.industry === industry);
        const baseValue = benchmark?.benchmark_value || Math.floor(Math.random() * 50) + 20;
        
        // Add some variation by year
        const yearIndex = years.indexOf(year);
        const variation = (yearIndex - 2) * (selectedMetric === 'waste_recycling' ? 5 : -3);
        
        dataPoint[industry] = Math.max(5, baseValue + variation);
      });
      
      return dataPoint;
    });
    
    setChartData(chartData);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-xl">ESG Industry Benchmarks</CardTitle>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                {industries.find(i => i.id === industry)?.name || 'All Industries'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {industries.map((ind) => (
                <DropdownMenuItem 
                  key={ind.id}
                  onClick={() => setIndustry(ind.id)}
                >
                  {ind.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <CardDescription>
          Compare your performance against industry standards
        </CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {metrics.map((metric) => (
            <Button 
              key={metric.id}
              variant={selectedMetric === metric.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric(metric.id)}
            >
              {metric.name}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Loading benchmark data...</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData} 
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                {industries.slice(1).map((industry, index) => (
                  <Line 
                    key={industry.id}
                    type="monotone" 
                    dataKey={industry.id} 
                    name={industry.name}
                    stroke={getIndustryColor(index)}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        <div className="mt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Source: Industry sustainability reports and public disclosures</span>
            <span>
              Unit: {metrics.find(m => m.id === selectedMetric)?.unit || 'Value'}
            </span>
          </div>
          
          <p className="mt-2">
            Your company is <span className="font-semibold text-green-600">12% better</span> than 
            the industry average for {metrics.find(m => m.id === selectedMetric)?.name.toLowerCase()}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

function getDemoBenchmarks(): ESGBenchmark[] {
  return [
    { 
      id: '1', 
      industry: 'technology', 
      benchmark_name: 'Carbon Intensity', 
      benchmark_value: 35.4, 
      unit: 'tCO2e/$M', 
      source: 'Industry Reports', 
      year: 2023, 
      region: 'Global', 
      category: 'emissions', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '2', 
      industry: 'manufacturing', 
      benchmark_name: 'Carbon Intensity', 
      benchmark_value: 87.2, 
      unit: 'tCO2e/$M', 
      source: 'Industry Reports', 
      year: 2023, 
      region: 'Global', 
      category: 'emissions', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '3', 
      industry: 'financial', 
      benchmark_name: 'Carbon Intensity', 
      benchmark_value: 12.8, 
      unit: 'tCO2e/$M', 
      source: 'Industry Reports', 
      year: 2023, 
      region: 'Global', 
      category: 'emissions', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '4', 
      industry: 'energy', 
      benchmark_name: 'Carbon Intensity', 
      benchmark_value: 142.5, 
      unit: 'tCO2e/$M', 
      source: 'Industry Reports', 
      year: 2023, 
      region: 'Global', 
      category: 'emissions', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '5', 
      industry: 'retail', 
      benchmark_name: 'Carbon Intensity', 
      benchmark_value: 45.1, 
      unit: 'tCO2e/$M', 
      source: 'Industry Reports', 
      year: 2023, 
      region: 'Global', 
      category: 'emissions', 
      created_at: new Date().toISOString() 
    }
  ];
}

function getIndustryColor(index: number): string {
  const colors = [
    '#3b82f6', // blue
    '#16a34a', // green
    '#ef4444', // red
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899'  // pink
  ];
  
  return colors[index % colors.length];
}

export default ESGBenchmarkCard;
