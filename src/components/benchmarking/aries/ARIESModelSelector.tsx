
import { ARIESModel } from "./types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Grid3X3, Eye } from "lucide-react";

interface ARIESModelSelectorProps {
  models: ARIESModel[];
  selectedModelId: string | null;
  onSelectModel: (id: string) => void;
}

const ARIESModelSelector = ({ models, selectedModelId, onSelectModel }: ARIESModelSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select an Environmental Model</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <Card 
            key={model.id}
            className={`cursor-pointer transition hover:border-primary/50 ${
              selectedModelId === model.id ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => onSelectModel(model.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{model.name}</CardTitle>
                <Badge variant={model.complexity === 'simple' ? 'outline' : 'default'}>
                  {model.complexity}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{model.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Data Requirements:</span>
                  <span>{model.dataRequirements}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span>{model.processingTime}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectModel(model.id);
                }}
              >
                {selectedModelId === model.id ? (
                  <Grid3X3 className="h-3 w-3 mr-1" />
                ) : (
                  <Eye className="h-3 w-3 mr-1" />
                )}
                {selectedModelId === model.id ? 'Selected' : 'Select Model'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ARIESModelSelector;
