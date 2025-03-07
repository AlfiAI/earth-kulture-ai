
import { ReactNode } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";

interface MetricsCardProps {
  title: string;
  value: string;
  unit: string;
  trend: number;
  trendIcon: ReactNode;
  trendColor: string;
  trendText: string;
}

const MetricsCard = ({
  title,
  value,
  unit,
  trend,
  trendIcon,
  trendColor,
  trendText,
}: MetricsCardProps) => {
  return (
    <DashboardCard title={title}>
      <div className="flex flex-col space-y-1">
        <p className="text-xs text-muted-foreground">vs Previous Period</p>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{value}</span>
            <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
          </div>
          <div className={`flex items-center ${trendColor}`}>
            {trendIcon}
            <span className="text-sm font-medium">{trend}%</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{trendText}</p>
      </div>
    </DashboardCard>
  );
};

export default MetricsCard;
