
import { CompanyESGData, IndustryComparisonData } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as ChartIcon, Zap } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ESGScoreComparisonProps {
  companyData: CompanyESGData;
  comparisonData: IndustryComparisonData;
}

const ESGScoreComparison = ({ companyData, comparisonData }: ESGScoreComparisonProps) => {
  const { esgScores } = companyData;
  const { industryAverage, topPerformer } = comparisonData;
  
  // Prepare data for the chart
  const data = [
    {
      name: "Environmental",
      company: esgScores.environmental,
      industry: industryAverage.environmental,
      topPerformer: topPerformer.environmental
    },
    {
      name: "Social",
      company: esgScores.social,
      industry: industryAverage.social,
      topPerformer: topPerformer.social
    },
    {
      name: "Governance",
      company: esgScores.governance,
      industry: industryAverage.governance,
      topPerformer: topPerformer.governance
    },
    {
      name: "Total ESG",
      company: esgScores.total,
      industry: industryAverage.total,
      topPerformer: topPerformer.total
    }
  ];

  // Generate insights from the comparison
  const generateInsights = () => {
    const insights = [];
    
    // Overall performance compared to industry
    if (esgScores.total > industryAverage.total) {
      const difference = (esgScores.total - industryAverage.total).toFixed(1);
      insights.push(`${companyData.name} scores ${difference} points above the industry average in overall ESG performance.`);
    } else {
      const difference = (industryAverage.total - esgScores.total).toFixed(1);
      insights.push(`${companyData.name} scores ${difference} points below the industry average in overall ESG performance.`);
    }
    
    // Find strongest category
    const categories = ['environmental', 'social', 'governance'];
    let strongestCategory = categories[0];
    
    for (const category of categories) {
      if (esgScores[category as keyof typeof esgScores] > esgScores[strongestCategory as keyof typeof esgScores]) {
        strongestCategory = category;
      }
    }
    
    insights.push(`The company's strongest performance area is ${strongestCategory} with a score of ${esgScores[strongestCategory as keyof typeof esgScores]}.`);
    
    // Gap to top performer
    const totalGap = topPerformer.total - esgScores.total;
    if (totalGap > 20) {
      insights.push(`There is a significant gap of ${totalGap.toFixed(1)} points between ${companyData.name} and the top performer in the industry.`);
    } else if (totalGap > 0) {
      insights.push(`${companyData.name} is only ${totalGap.toFixed(1)} points behind the top performer in the industry.`);
    } else {
      insights.push(`${companyData.name} is the top performer in the industry for ESG performance.`);
    }
    
    return insights;
  };
  
  const insights = generateInsights();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <ChartIcon className="h-5 w-5 mr-2" />
          Industry Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="company" name={companyData.name} fill="#3b82f6" />
              <Bar dataKey="industry" name="Industry Average" fill="#6b7280" />
              <Bar dataKey="topPerformer" name="Top Performer" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center">
              <Zap className="h-4 w-4 mr-2 text-primary" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-primary mr-2">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ESGScoreComparison;
