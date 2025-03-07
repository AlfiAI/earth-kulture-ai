
import React from 'react';
import Chart from "./Chart";
import DashboardCard from "./DashboardCard";

// Sample ESG score data
const esgScoreData = [
  { name: 'Jan', score: 68 },
  { name: 'Feb', score: 72 },
  { name: 'Mar', score: 74 },
  { name: 'Apr', score: 78 },
  { name: 'May', score: 82 },
  { name: 'Jun', score: 80 },
  { name: 'Jul', score: 85 },
  { name: 'Aug', score: 88 }
];

// Sample category data
const categoryData = [
  { name: 'Environment', value: 85 },
  { name: 'Social', value: 72 },
  { name: 'Governance', value: 78 }
];

const ESGScoreProgression = () => {
  return (
    <DashboardCard
      title="ESG Score Progression"
      description="Historical performance"
      contentClassName="p-0"
    >
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {categoryData.map((category, index) => (
            <div key={index} className="flex flex-col text-center p-3 rounded-md bg-muted/50">
              <span className="text-lg font-semibold">{category.value}</span>
              <span className="text-sm text-muted-foreground">{category.name}</span>
            </div>
          ))}
        </div>
        
        <Chart
          data={esgScoreData}
          type="line"
          dataKey="score"
          height={236}
          colors={['#5a9c69']}
        />
      </div>
    </DashboardCard>
  );
};

export default ESGScoreProgression;
