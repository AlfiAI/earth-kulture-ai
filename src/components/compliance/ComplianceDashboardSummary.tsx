
import { ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { ComplianceItemType } from "./ComplianceItemCard";

type ComplianceDashboardSummaryProps = {
  complianceItems: ComplianceItemType[];
};

const ComplianceDashboardSummary = ({ complianceItems }: ComplianceDashboardSummaryProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
      <DashboardCard
        title="Overall Compliance"
        description="Across all frameworks"
        className="col-span-1"
      >
        <div className="flex flex-col items-center pt-3 pb-4">
          <div className="relative h-24 w-24 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
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
                strokeDashoffset="25"
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">75%</span>
            </div>
          </div>
          <div className="w-full flex justify-between mt-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>3 Compliant</span>
            </div>
            <div className="flex items-center gap-1 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span>1 At Risk</span>
            </div>
          </div>
        </div>
      </DashboardCard>
      
      <DashboardCard
        title="Next Deadlines"
        description="Upcoming requirements"
        className="col-span-1"
      >
        <div className="space-y-3 pt-2">
          {complianceItems
            .filter(item => item.deadline)
            .sort((a, b) => new Date(a.deadline || '').getTime() - new Date(b.deadline || '').getTime())
            .slice(0, 3)
            .map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Due {item.deadline}</p>
                </div>
                <Badge
                  className={cn(
                    "text-xs",
                    item.status === 'Compliant' && "bg-green-100 text-green-800",
                    item.status === 'In Progress' && "bg-blue-100 text-blue-800",
                    item.status === 'Attention Needed' && "bg-amber-100 text-amber-800"
                  )}
                >
                  {item.status}
                </Badge>
              </div>
            ))}
        </div>
      </DashboardCard>
      
      <DashboardCard
        title="Recent Updates"
        description="Framework changes"
        className="col-span-1"
      >
        <div className="space-y-3 pt-2">
          <div className="border-l-2 border-blue-500 pl-3">
            <p className="text-sm font-medium">EU Taxonomy Update</p>
            <p className="text-xs text-muted-foreground">New requirements added for biodiversity reporting</p>
            <p className="text-xs text-muted-foreground">3 days ago</p>
          </div>
          <div className="border-l-2 border-green-500 pl-3">
            <p className="text-sm font-medium">GHG Protocol</p>
            <p className="text-xs text-muted-foreground">Your report was verified and approved</p>
            <p className="text-xs text-muted-foreground">1 week ago</p>
          </div>
          <div className="border-l-2 border-amber-500 pl-3">
            <p className="text-sm font-medium">SASB Standards</p>
            <p className="text-xs text-muted-foreground">Framework updates announced for Q1 2024</p>
            <p className="text-xs text-muted-foreground">2 weeks ago</p>
          </div>
        </div>
      </DashboardCard>
      
      <DashboardCard
        title="Improvement"
        description="Month over month"
        className="col-span-1"
      >
        <div className="pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Score</span>
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <ArrowUpRight className="h-3 w-3" />
              <span>8%</span>
            </div>
          </div>
          <Progress value={75} className="h-2 mb-4" />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Documentation</span>
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <ArrowUpRight className="h-3 w-3" />
                <span>12%</span>
              </div>
            </div>
            <Progress value={82} className="h-1.5" />
            
            <div className="flex items-center justify-between">
              <span className="text-xs">Data Quality</span>
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <ArrowUpRight className="h-3 w-3" />
                <span>5%</span>
              </div>
            </div>
            <Progress value={70} className="h-1.5" />
            
            <div className="flex items-center justify-between">
              <span className="text-xs">Verification</span>
              <div className="flex items-center gap-1 text-amber-600 text-xs">
                <ArrowDownRight className="h-3 w-3" />
                <span>3%</span>
              </div>
            </div>
            <Progress value={65} className="h-1.5" />
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default ComplianceDashboardSummary;
