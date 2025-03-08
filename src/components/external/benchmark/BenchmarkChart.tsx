
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getIndustryColor } from "./benchmarkUtils";

interface BenchmarkChartProps {
  chartData: any[];
  industries: { id: string; name: string }[];
  isLoading: boolean;
}

const BenchmarkChart = ({ chartData, industries, isLoading }: BenchmarkChartProps) => {
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <p className="text-muted-foreground">Loading benchmark data...</p>
      </div>
    );
  }

  return (
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
  );
};

export default BenchmarkChart;
