
import { CompanyESGData } from "./types";
import { BarChart as ChartIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface ESGScoreChartProps {
  companyData: CompanyESGData;
}

const ESGScoreChart = ({ companyData }: ESGScoreChartProps) => {
  const { esgScores } = companyData;
  
  const data = [
    {
      name: "Environmental",
      score: esgScores.environmental,
    },
    {
      name: "Social",
      score: esgScores.social,
    },
    {
      name: "Governance",
      score: esgScores.governance,
    },
    {
      name: "Total ESG",
      score: esgScores.total,
    }
  ];

  const getBarColor = (score: number) => {
    if (score >= 80) return "#10b981"; // Green for excellent
    if (score >= 60) return "#3b82f6"; // Blue for good
    if (score >= 40) return "#f59e0b"; // Amber for average
    return "#ef4444"; // Red for poor
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            fontSize={12} 
            tickLine={false}
            axisLine={{ strokeOpacity: 0.3 }}
          />
          <YAxis 
            domain={[0, 100]} 
            fontSize={12}
            tickLine={false}
            axisLine={{ strokeOpacity: 0.3 }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}/100`, "Score"]}
            contentStyle={{ 
              borderRadius: "6px", 
              border: "1px solid rgba(0,0,0,0.1)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)" 
            }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ESGScoreChart;
