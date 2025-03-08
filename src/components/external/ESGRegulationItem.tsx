
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define impact level type with specific allowed values
export type RegulationImpactLevel = 'high' | 'medium' | 'low' | 'unknown';

// Create a more detailed interface for regulations
export interface Regulation {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  impact_level?: RegulationImpactLevel;
  published_date?: string;
  tags?: string[];
  category?: string;
  country?: string;
}

interface ESGRegulationItemProps {
  regulation: Regulation;
  className?: string;
  maxTagsToShow?: number;
  showCategory?: boolean;
  onTagClick?: (tag: string) => void;
}

const ESGRegulationItem = ({ 
  regulation, 
  className,
  maxTagsToShow = 3,
  showCategory = false,
  onTagClick
}: ESGRegulationItemProps) => {
  // Map impact levels to badge variants
  const getBadgeVariant = (impact?: RegulationImpactLevel) => {
    switch(impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  // Format the date if available
  const formattedDate = regulation.published_date 
    ? new Date(regulation.published_date).toLocaleDateString() 
    : null;

  return (
    <div 
      className={cn(
        "p-4 border rounded-lg hover:bg-accent/10 transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium">{regulation.title}</h3>
        <Badge 
          variant={getBadgeVariant(regulation.impact_level as RegulationImpactLevel)}
        >
          {regulation.impact_level || 'Unknown'} Impact
        </Badge>
      </div>
      
      <div className="flex items-center text-xs text-muted-foreground mb-2">
        <span className="mr-2">Source: {regulation.source}</span>
        {formattedDate && (
          <span>
            • Published: {formattedDate}
          </span>
        )}
        {showCategory && regulation.category && (
          <span className="ml-2">• Category: {regulation.category}</span>
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
            {regulation.tags.slice(0, maxTagsToShow).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-secondary/80"
                onClick={() => onTagClick && onTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
            {regulation.tags.length > maxTagsToShow && (
              <Badge variant="outline" className="text-xs">
                +{regulation.tags.length - maxTagsToShow}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ESGRegulationItem;
