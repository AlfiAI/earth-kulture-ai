
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InsightCard from "@/components/dashboard/InsightCard";

// Sample insights data - we're using the same data from the original file
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
  },
  {
    type: 'trend',
    title: 'Water usage optimization',
    description: 'Your facilities have reduced water consumption by 8% this quarter through the implementation of water recycling systems.',
    indicator: 'down',
    percentageChange: -8,
    date: 'July 22, 2023'
  },
  {
    type: 'recommendation',
    title: 'Supply chain emission hotspots',
    description: 'We\'ve identified 3 key suppliers contributing to 45% of your Scope 3 emissions. Engaging with these suppliers could significantly reduce your overall footprint.',
    date: 'July 15, 2023'
  },
  {
    type: 'info',
    title: 'Renewable energy credits',
    description: 'Current REC prices are at a 2-year low. Consider purchasing additional credits to offset remaining Scope 2 emissions and meet your annual targets.',
    date: 'July 10, 2023'
  },
  {
    type: 'alert',
    title: 'Data quality issue',
    description: 'We\'ve detected inconsistencies in your transportation emissions data. This may affect the accuracy of your Scope 1 reporting by up to 7%.',
    date: 'July 5, 2023'
  }
];

const InsightsContent = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Insights</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleInsights.map((insight, index) => (
            <InsightCard
              key={index}
              type={insight.type as any}
              title={insight.title}
              description={insight.description}
              indicator={insight.indicator as any}
              percentageChange={insight.percentageChange}
              date={insight.date}
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="trends">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleInsights
            .filter(insight => insight.type === 'trend')
            .map((insight, index) => (
              <InsightCard
                key={index}
                type={insight.type as any}
                title={insight.title}
                description={insight.description}
                indicator={insight.indicator as any}
                percentageChange={insight.percentageChange}
                date={insight.date}
              />
            ))}
        </div>
      </TabsContent>
      
      <TabsContent value="recommendations">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleInsights
            .filter(insight => insight.type === 'recommendation')
            .map((insight, index) => (
              <InsightCard
                key={index}
                type={insight.type as any}
                title={insight.title}
                description={insight.description}
                date={insight.date}
              />
            ))}
        </div>
      </TabsContent>
      
      <TabsContent value="alerts">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleInsights
            .filter(insight => insight.type === 'alert')
            .map((insight, index) => (
              <InsightCard
                key={index}
                type={insight.type as any}
                title={insight.title}
                description={insight.description}
                date={insight.date}
              />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default InsightsContent;
