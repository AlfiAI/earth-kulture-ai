
import React from 'react';
import DashboardCard from "./DashboardCard";

const DashboardESGScore = () => {
  return (
    <DashboardCard
      title="ESG Score"
      description="Overall performance"
      className="col-span-1"
    >
      <div className="flex flex-col items-center justify-center pt-2 pb-4">
        <div className="relative h-32 w-32 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="h-32 w-32 -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-muted"
                strokeWidth="2"
              ></circle>
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-primary"
                strokeWidth="2"
                strokeDasharray="100"
                strokeDashoffset="12"
                strokeLinecap="round"
              ></circle>
            </svg>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">88</span>
            <span className="text-xs text-muted-foreground">out of 100</span>
          </div>
        </div>
        
        <div className="w-full flex justify-between text-sm mt-4">
          <div className="flex flex-col items-center">
            <span className="font-medium">E</span>
            <span className="text-xs text-muted-foreground">85/100</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-medium">S</span>
            <span className="text-xs text-muted-foreground">72/100</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-medium">G</span>
            <span className="text-xs text-muted-foreground">78/100</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default DashboardESGScore;
