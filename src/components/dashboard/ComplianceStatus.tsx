
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardCard from "./DashboardCard";
import { cn } from "@/lib/utils";

// Sample compliance items
const complianceItems = [
  {
    name: 'GHG Protocol',
    status: 'Compliant',
    score: 92,
    lastUpdated: '2 days ago',
    deadline: null
  },
  {
    name: 'TCFD Reporting',
    status: 'In Progress',
    score: 68,
    lastUpdated: '5 days ago',
    deadline: 'Sep 30, 2023'
  },
  {
    name: 'EU Taxonomy',
    status: 'Attention Needed',
    score: 45,
    lastUpdated: '12 days ago',
    deadline: 'Oct 15, 2023'
  }
];

const ComplianceStatus = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardCard
      title="Compliance Status"
      description="Framework adherence"
      className="col-span-1"
    >
      <div className="space-y-3 pt-2">
        {complianceItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-xs text-muted-foreground">
                {item.lastUpdated}
              </span>
            </div>
            <Badge
              className={cn(
                "text-xs",
                item.status === 'Compliant' && "bg-green-100 text-green-800 hover:bg-green-200",
                item.status === 'In Progress' && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                item.status === 'Attention Needed' && "bg-amber-100 text-amber-800 hover:bg-amber-200"
              )}
            >
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
        <span>12 frameworks tracked</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs text-primary"
          onClick={() => navigate('/compliance')}
        >
          View all
        </Button>
      </div>
    </DashboardCard>
  );
};

export default ComplianceStatus;
