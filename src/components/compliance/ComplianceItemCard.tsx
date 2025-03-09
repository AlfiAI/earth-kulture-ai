
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import StatusIcon from "./StatusIcon";

export type ComplianceItemType = {
  name: string;
  status: string;
  score: number;
  lastUpdated: string;
  deadline: string | null;
  description: string;
};

type ComplianceItemCardProps = {
  item: ComplianceItemType;
};

const ComplianceItemCard = ({ item }: ComplianceItemCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <StatusIcon status={item.status} />
            <h3 className="font-medium">{item.name}</h3>
            <Badge
              className={cn(
                "ml-2 text-xs",
                item.status === 'Compliant' && "bg-green-100 text-green-800",
                item.status === 'In Progress' && "bg-blue-100 text-blue-800",
                item.status === 'Attention Needed' && "bg-amber-100 text-amber-800"
              )}
            >
              {item.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
            <span>Last updated: {item.lastUpdated}</span>
            {item.deadline && <span>Deadline: {item.deadline}</span>}
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Score:</span>
            <span className="font-medium">{item.score}/100</span>
          </div>
          <Progress value={item.score} className="w-full md:w-40 h-2" />
          <Button size="sm" variant="outline" className="mt-1 text-xs">View Details</Button>
        </div>
      </div>
    </Card>
  );
};

export default ComplianceItemCard;
