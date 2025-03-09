
import { ESGBenchmark } from "@/services/external/types/externalTypes";

export function getIndustryColor(index: number): string {
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

export function getDemoBenchmarks(): ESGBenchmark[] {
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
      category: 'emissions'
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
      category: 'emissions'
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
      category: 'emissions'
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
      category: 'emissions'
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
      category: 'emissions'
    }
  ];
}

export function prepareChartDataFromDemoData(
  demoData: ESGBenchmark[], 
  selectedMetric: string
): any[] {
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
  
  return chartData;
}
