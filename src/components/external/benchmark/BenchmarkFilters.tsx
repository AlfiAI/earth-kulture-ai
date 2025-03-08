
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface BenchmarkFiltersProps {
  industries: { id: string; name: string }[];
  metrics: { id: string; name: string; unit: string }[];
  selectedIndustry: string;
  selectedMetric: string;
  setIndustry: (industry: string) => void;
  setSelectedMetric: (metric: string) => void;
}

const BenchmarkFilters = ({
  industries,
  metrics,
  selectedIndustry,
  selectedMetric,
  setIndustry,
  setSelectedMetric
}: BenchmarkFiltersProps) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              {industries.find(i => i.id === selectedIndustry)?.name || 'All Industries'}
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
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {metrics.map((metric) => (
          <Button 
            key={metric.id}
            variant={selectedMetric === metric.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMetric(metric.id)}
          >
            {metric.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BenchmarkFilters;
