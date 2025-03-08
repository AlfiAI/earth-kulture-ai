
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ESGRegulation } from "@/services/external/externalDataService";
import ESGRegulationItem from "./ESGRegulationItem";

interface ESGRegulationsContentProps {
  regulations: ESGRegulation[];
  isLoading: boolean;
  handleRefresh: () => Promise<void>;
  onTagClick?: (tag: string) => void;
}

const ESGRegulationsContent = ({ 
  regulations, 
  isLoading, 
  handleRefresh,
  onTagClick
}: ESGRegulationsContentProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-muted-foreground">Loading regulatory updates...</p>
      </div>
    );
  }

  if (regulations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No regulatory updates available</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={handleRefresh}
        >
          Refresh Data
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {regulations.map((regulation) => (
        <ESGRegulationItem 
          key={regulation.id} 
          regulation={regulation}
          onTagClick={onTagClick}
          showCategory={true}
        />
      ))}
    </div>
  );
};

export default ESGRegulationsContent;
