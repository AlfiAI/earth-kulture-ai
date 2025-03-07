
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import InsightCard from "./InsightCard";

// Sample insights
const sampleInsights = [
  {
    type: 'trend',
    title: 'Carbon intensity decreasing',
    description: 'Your carbon intensity per revenue has decreased by 12% compared to last quarter, putting you ahead of industry average.',
    indicator: 'down',
    percentageChange: -12,
    date: 'August 15, 2023'
  },
  {
    type: 'recommendation',
    title: 'Renewable energy opportunity',
    description: 'Based on your energy usage patterns, switching to renewable sources for your main facility could reduce Scope 2 emissions by up to 35% and generate ROI within 3 years.',
    date: 'August 10, 2023'
  },
  {
    type: 'alert',
    title: 'Compliance risk detected',
    description: 'New ESG reporting requirements will become mandatory in your region by Q1 next year. 3 of your current metrics need adjustments to comply.',
    date: 'August 5, 2023'
  },
  {
    type: 'info',
    title: 'Industry benchmark update',
    description: "Your sector's average ESG performance has improved by 5% this quarter. Your company maintains a position in the top quartile.",
    indicator: 'up',
    percentageChange: 8,
    date: 'July 28, 2023'
  }
];

const AIInsights = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">AI-Generated Insights</h2>
        <Button variant="outline" size="sm" onClick={() => navigate('/insights')}>View all insights</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleInsights.slice(0, 4).map((insight, index) => (
          <InsightCard
            key={index}
            type={insight.type as any}
            title={insight.title}
            description={insight.description}
            indicator={insight.indicator as any}
            percentageChange={insight.percentageChange}
            date={insight.date}
            onClick={() => navigate('/insights')}
          />
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
