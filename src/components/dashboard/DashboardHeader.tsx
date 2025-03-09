
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useDashboard } from "@/contexts/dashboard/DashboardContext";

const DashboardHeader = () => {
  const { userProfile } = useAuth();
  const { dashboardType } = useDashboard();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">ESG Dashboard</h1>
        <p className="text-muted-foreground">
          {dashboardType === 'individual' ? 'Personal Sustainability Tracking' :
          dashboardType === 'business' ? 'Business ESG Performance' :
          'Enterprise Sustainability Management'}
        </p>
      </div>
      
      {userProfile?.industry && (
        <Badge variant="outline" className="mt-2 md:mt-0 px-3 py-1 flex items-center gap-1.5">
          <Building className="h-3.5 w-3.5" />
          {userProfile.industry.charAt(0).toUpperCase() + userProfile.industry.slice(1)}
        </Badge>
      )}
    </div>
  );
};

export default DashboardHeader;
