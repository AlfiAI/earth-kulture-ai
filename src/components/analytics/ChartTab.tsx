
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "@/components/dashboard/Chart";

interface ChartTabProps {
  title: string;
  description: string;
  data: any[];
  dateRange: "daily" | "weekly" | "monthly" | "yearly";
  setDateRange: (value: "daily" | "weekly" | "monthly" | "yearly") => void;
  colors: string[];
}

const ChartTab = ({
  title,
  description,
  data,
  dateRange,
  setDateRange,
  colors,
}: ChartTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex items-center gap-2">
            <select
              className="border rounded px-2 py-1 text-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Chart 
            data={data}
            dataKey="value"
            xAxisKey="name"
            type="line"
            colors={colors}
            showTabs={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartTab;
