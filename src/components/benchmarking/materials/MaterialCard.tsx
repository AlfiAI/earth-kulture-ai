
import { Material } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface MaterialCardProps {
  material: Material;
  onClick: () => void;
  onToggleCompare: () => void;
  compareMode: boolean;
  isSelected: boolean;
  selectedCount?: number;
}

const MaterialCard = ({ 
  material, 
  onClick, 
  onToggleCompare, 
  compareMode,
  isSelected,
  selectedCount = 0
}: MaterialCardProps) => {
  const { name, category, sustainabilityScore, properties } = material;
  const maxSelectionsReached = selectedCount >= 3;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card 
      className={`cursor-pointer hover:border-primary/50 transition ${
        isSelected ? 'border-primary bg-primary/5' : ''
      }`} 
      onClick={compareMode ? undefined : onClick}
    >
      <CardHeader className="pb-2 pt-4 flex flex-row justify-between items-start">
        {compareMode && (
          <div className="mr-2 mt-1" onClick={(e) => e.stopPropagation()}>
            <Checkbox 
              checked={isSelected}
              onCheckedChange={() => onToggleCompare()}
              disabled={!isSelected && maxSelectionsReached}
            />
          </div>
        )}
        <div className="flex-1">
          <CardTitle className="text-base">{name}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">{category}</p>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(sustainabilityScore)}`}>
          {sustainabilityScore}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          {properties.recyclable && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              Recyclable
            </Badge>
          )}
          {properties.biodegradable && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              Biodegradable
            </Badge>
          )}
          {properties.lowCarbon && (
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
              Low Carbon
            </Badge>
          )}
          {properties.certificated && (
            <Badge variant="outline" className="text-xs bg-violet-50 text-violet-700 border-violet-200">
              Certified
            </Badge>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Carbon Footprint:</span>
            <span>{material.metrics.carbonFootprint} kg CO2e</span>
          </div>
          <div className="flex justify-between">
            <span>Water Usage:</span>
            <span>{material.metrics.waterUsage} L</span>
          </div>
          <div className="flex justify-between">
            <span>Energy Usage:</span>
            <span>{material.metrics.energyUsage} MJ</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
