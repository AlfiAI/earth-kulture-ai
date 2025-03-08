
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ESGRegulation } from "@/services/external/externalDataService";

interface ESGRegulationItemProps {
  regulation: ESGRegulation;
}

const ESGRegulationItem = ({ regulation }: ESGRegulationItemProps) => {
  return (
    <div 
      key={regulation.id} 
      className="p-4 border rounded-lg hover:bg-accent/10 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium">{regulation.title}</h3>
        <Badge 
          variant={
            regulation.impact_level === 'high' 
              ? 'destructive' 
              : regulation.impact_level === 'medium' 
                ? 'default' 
                : 'outline'
          }
        >
          {regulation.impact_level || 'Unknown'} Impact
        </Badge>
      </div>
      
      <div className="flex items-center text-xs text-muted-foreground mb-2">
        <span className="mr-2">Source: {regulation.source}</span>
        {regulation.published_date && (
          <span>
            • Published: {new Date(regulation.published_date).toLocaleDateString()}
          </span>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {regulation.content}
      </p>
      
      <div className="flex items-center">
        <Button 
          variant="link" 
          size="sm" 
          className="h-auto p-0"
          asChild
        >
          <a 
            href={regulation.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center"
          >
            Read More
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </Button>
        
        {regulation.tags && regulation.tags.length > 0 && (
          <div className="ml-auto flex gap-1">
            {regulation.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ESGRegulationItem;
