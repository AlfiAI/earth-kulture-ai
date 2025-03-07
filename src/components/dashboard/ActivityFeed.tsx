
import React from 'react';
import { RefreshCw, Leaf, Users } from 'lucide-react';
import DashboardCard from "./DashboardCard";

const ActivityFeed = () => {
  return (
    <DashboardCard
      title="Activity"
      description="Recent updates"
      className="col-span-1"
    >
      <div className="space-y-3 pt-2">
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="h-4 w-4 text-sky-700" />
          </div>
          <div>
            <p className="text-sm font-medium">Data updated</p>
            <p className="text-xs text-muted-foreground">Energy consumption data refreshed</p>
            <p className="text-xs text-muted-foreground">2 hours ago</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Leaf className="h-4 w-4 text-green-700" />
          </div>
          <div>
            <p className="text-sm font-medium">Report generated</p>
            <p className="text-xs text-muted-foreground">Q2 Sustainability report created</p>
            <p className="text-xs text-muted-foreground">Yesterday</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 text-amber-700" />
          </div>
          <div>
            <p className="text-sm font-medium">Team member added</p>
            <p className="text-xs text-muted-foreground">Sarah Johnson joined as Analyst</p>
            <p className="text-xs text-muted-foreground">2 days ago</p>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default ActivityFeed;
