import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart3, Award, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { externalDataService, ESGBenchmark } from "@/services/external/externalDataService";

const ESGBenchmarkCard = () => {
  const [benchmarks, setBenchmarks] = useState<ESGBenchmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  
  const industries = [
    { value: "all", label: "All Industries" },
    { value: "technology", label: "Technology" },
    { value: "finance", label: "Finance" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "healthcare", label: "Healthcare" },
    { value: "energy", label: "Energy" },
    { value: "retail", label: "Retail" },
  ];
  
  // Prepare data for chart
  const prepareChartData = (benchmarks: ESGBenchmark[]) => {
    const categories = [...new Set(benchmarks.map(b => b.category))];
    
    // Group by industry
    const byIndustry: Record<string, Record<string, number>> = {};
    
    benchmarks.forEach(benchmark => {
      if (!byIndustry[benchmark.industry]) {
        byIndustry[benchmark.industry] = {};
      }
      
      byIndustry[benchmark.industry][benchmark.category] = benchmark.benchmark_value;
    });
    
    // Convert to chart data format
    return Object.keys(byIndustry).map(industry => ({
      industry,
      ...byIndustry[industry]
    }));
  };
  
  const fetchBenchmarks = async () => {
    setIsLoading(true);
    
    try {
      const industry = selectedIndustry !== "all" ? selectedIndustry : undefined;
      const data = await externalDataService.getESGBenchmarks(industry);
      
      // If no real data yet, use demo data
      if (data.length === 0) {
        setBenchmarks(getDemoBenchmarks());
      } else {
        setBenchmarks(data);
      }
    } catch (error) {
      console.error("Error fetching benchmarks:", error);
      // Fall back to demo data
      setBenchmarks(getDemoBenchmarks());
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleIndustryChange = (value: string) => {
    setSelectedIndustry(value);
  };
  
  useEffect(() => {
    fetchBenchmarks();
  }, [selectedIndustry]);
  
  const chartData = prepareChartData(benchmarks);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              ESG Industry Benchmarks
            </CardTitle>
            <CardDescription>
              Compare performance against industry standards
            </CardDescription>
          </div>
          
          <Select 
            value={selectedIndustry} 
            onValueChange={handleIndustryChange}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">Loading benchmarks...</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData} 
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="industry"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="carbon_intensity" 
                  name="Carbon Intensity"
                  stroke="#10b981" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="water_usage" 
                  name="Water Usage"
                  stroke="#3b82f6" 
                />
                <Line 
                  type="monotone" 
                  dataKey="waste_recycling" 
                  name="Waste Recycling"
                  stroke="#8b5cf6" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
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
      benchmark_value: 0.12, 
      unit: 'tCO2e/$M', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'carbon_intensity', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '2', 
      industry: 'technology', 
      benchmark_name: 'Water Usage', 
      benchmark_value: 0.9, 
      unit: 'kL/$M', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'water_usage', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '3', 
      industry: 'technology', 
      benchmark_name: 'Waste Recycling', 
      benchmark_value: 82, 
      unit: '%', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'waste_recycling', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '4', 
      industry: 'finance', 
      benchmark_name: 'Carbon Intensity', 
      benchmark_value: 0.05, 
      unit: 'tCO2e/$M', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'carbon_intensity', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '5', 
      industry: 'finance', 
      benchmark_name: 'Water Usage', 
      benchmark_value: 0.6, 
      unit: 'kL/$M', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'water_usage', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '6', 
      industry: 'finance', 
      benchmark_name: 'Waste Recycling', 
      benchmark_value: 75, 
      unit: '%', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'waste_recycling', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '7', 
      industry: 'manufacturing', 
      benchmark_name: 'Carbon Intensity', 
      benchmark_value: 0.58, 
      unit: 'tCO2e/$M', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'carbon_intensity', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '8', 
      industry: 'manufacturing', 
      benchmark_name: 'Water Usage', 
      benchmark_value: 4.2, 
      unit: 'kL/$M', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'water_usage', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '9', 
      industry: 'manufacturing', 
      benchmark_name: 'Waste Recycling', 
      benchmark_value: 67, 
      unit: '%', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'waste_recycling', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '10', 
      industry: 'healthcare', 
      benchmark_name: 'Carbon Intensity', 
      benchmark_value: 0.17, 
      unit: 'tCO2e/$M', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'carbon_intensity', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '11', 
      industry: 'healthcare', 
      benchmark_name: 'Water Usage', 
      benchmark_value: 2.1, 
      unit: 'kL/$M', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'water_usage', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '12', 
      industry: 'healthcare', 
      benchmark_name: 'Waste Recycling', 
      benchmark_value: 69, 
      unit: '%', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'waste_recycling', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '13', 
      industry: 'energy', 
      benchmark_name: 'Carbon Intensity', 
      benchmark_value: 1.24, 
      unit: 'tCO2e/$M', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'carbon_intensity', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '14', 
      industry: 'energy', 
      benchmark_name: 'Water Usage', 
      benchmark_value: 6.8, 
      unit: 'kL/$M', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'water_usage', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '15', 
      industry: 'energy', 
      benchmark_name: 'Waste Recycling', 
      benchmark_value: 58, 
      unit: '%', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'waste_recycling', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '16', 
      industry: 'retail', 
      benchmark_name: 'Carbon Intensity', 
      benchmark_value: 0.21, 
      unit: 'tCO2e/$M', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'carbon_intensity', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '17', 
      industry: 'retail', 
      benchmark_name: 'Water Usage', 
      benchmark_value: 1.3, 
      unit: 'kL/$M', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'water_usage', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '18', 
      industry: 'retail', 
      benchmark_name: 'Waste Recycling', 
      benchmark_value: 71, 
      unit: '%', 
      source: 'Industry Average', 
      year: 2023, 
      region: 'Global', 
      category: 'waste_recycling', 
      created_at: new Date().toISOString() 
    },
  ];
}

export default ESGBenchmarkCard;
