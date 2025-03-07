
import { TrendingDown, TrendingUp } from "lucide-react";
import MetricsCard from "./MetricsCard";

const MetricsSection = () => {
  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
      <MetricsCard
        title="Carbon Intensity"
        value="8.2"
        unit="tCO2e/M$"
        trend={-12.4}
        trendIcon={<TrendingDown className="h-4 w-4 mr-1" />}
        trendColor="text-green-600"
        trendText="Lower is better"
      />
      
      <MetricsCard
        title="ESG Score"
        value="81"
        unit="/100"
        trend={3.5}
        trendIcon={<TrendingUp className="h-4 w-4 mr-1" />}
        trendColor="text-green-600"
        trendText="Top quartile"
      />
      
      <MetricsCard
        title="Energy Usage"
        value="98,000"
        unit="kWh"
        trend={-7.8}
        trendIcon={<TrendingDown className="h-4 w-4 mr-1" />}
        trendColor="text-green-600"
        trendText="Reduction trend"
      />
    </div>
  );
};

export default MetricsSection;
