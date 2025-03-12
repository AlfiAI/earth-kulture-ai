
import { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth";
import { IndustryType } from "@/services/ai/orchestration/types/agentTypes";

interface BenchmarkFiltersProps {
  industries?: { id: string; name: string }[];
  metrics?: { id: string; name: string; unit: string }[];
  selectedIndustry?: string;
  selectedMetric?: string;
  setIndustry?: (industry: string) => void;
  setSelectedMetric?: (metric: string) => void;
  // Legacy props for backward compatibility
  industry?: string;
  metric?: string;
}

const BenchmarkFilters = ({
  industries = [{ id: 'all', name: 'All Industries' }],
  metrics = [],
  selectedIndustry,
  selectedMetric,
  setIndustry = () => {},
  setSelectedMetric = () => {},
  industry, // For backward compatibility
  metric // For backward compatibility
}: BenchmarkFiltersProps) => {
  // Use either new or legacy props
  const currentIndustry = selectedIndustry || industry || 'all';
  const { userProfile } = useAuth();
  
  // Auto-select user's industry if available
  useEffect(() => {
    if (userProfile?.industry && !selectedIndustry && !industry) {
      const userIndustry = userProfile.industry as string;
      // Handle mapping industry from IndustryType to filter values
      const mappedIndustry = userIndustry === IndustryType.CORPORATE || userIndustry === IndustryType.SME ? 'all' : userIndustry;
      
      // Check if the user's industry exists in the available industries
      if (industries.some(ind => ind.id === mappedIndustry)) {
        setIndustry(mappedIndustry);
      }
    }
  }, [userProfile, industries, setIndustry, selectedIndustry, industry]);
  
  return (
    <div>
      <div className="flex justify-between mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              {industries.find(i => i.id === currentIndustry)?.name || 'All Industries'}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {industries.map((ind) => (
              <DropdownMenuItem 
                key={ind.id}
                onClick={() => setIndustry(ind.id)}
              >
                {ind.name}
                {userProfile?.industry === ind.id && (
                  <span className="ml-2 text-xs text-muted-foreground">(Your industry)</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {metrics.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {metrics.map((metricItem) => (
            <Button 
              key={metricItem.id}
              variant={selectedMetric === metricItem.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric(metricItem.id)}
            >
              {metricItem.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BenchmarkFilters;
