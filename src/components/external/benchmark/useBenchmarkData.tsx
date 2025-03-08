
import { useState, useEffect } from "react";
import { ESGBenchmark, benchmarkService } from "@/services/external/externalDataService";
import { getDemoBenchmarks, prepareChartDataFromDemoData } from "./benchmarkUtils";

export function useBenchmarkData() {
  const [benchmarks, setBenchmarks] = useState<ESGBenchmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
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
      setChartData(prepareChartDataFromDemoData(demoData, selectedMetric));
    }
  }, [benchmarks, selectedMetric]);
  
  const fetchBenchmarks = async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const industryFilter = industry !== "all" ? industry : undefined;
      const data = await benchmarkService.getESGBenchmarks(industryFilter);
      
      if (data && data.length > 0) {
        setBenchmarks(data);
      } else {
        // If no data is returned or empty array, use demo data
        setBenchmarks(getDemoBenchmarks());
      }
    } catch (error) {
      console.error("Error fetching benchmarks:", error);
      setIsError(true);
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

  return {
    benchmarks,
    isLoading,
    isError,
    industry,
    setIndustry,
    chartData,
    selectedMetric,
    setSelectedMetric,
    metrics,
    industries,
    refreshData: fetchBenchmarks
  };
}
