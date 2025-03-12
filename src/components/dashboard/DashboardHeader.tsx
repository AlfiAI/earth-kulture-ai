
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useDashboard } from "@/contexts/dashboard/DashboardContext";

const DashboardHeader = () => {
  const { userProfile } = useAuth();
  const { dashboardType } = useDashboard();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">ESG Dashboard</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          {dashboardType === 'individual' ? 'Personal Sustainability Tracking' :
          dashboardType === 'business' ? 'Business ESG Performance' :
          'Enterprise Sustainability Management'}
        </p>
      </div>
      
      {userProfile?.industry && (
        <Badge variant="outline" className="mt-2 md:mt-0 px-2 md:px-3 py-1 flex items-center gap-1 text-xs">
          <Building className="h-3 w-3 md:h-3.5 md:w-3.5" />
          {userProfile.industry.charAt(0).toUpperCase() + userProfile.industry.slice(1)}
        </Badge>
      )}
    </div>
  );
};

export default DashboardHeader;
