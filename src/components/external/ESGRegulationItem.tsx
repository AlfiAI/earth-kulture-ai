
import { ExternalLink, Tag } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ESGRegulation } from "@/services/external/externalDataService";
import { cn } from "@/lib/utils";

export type RegulationImpactLevel = 'high' | 'medium' | 'low';

interface ESGRegulationItemProps {
  regulation: ESGRegulation;
  onTagClick?: (tag: string) => void;
  showCategory?: boolean;
}

const ESGRegulationItem = ({ regulation, onTagClick, showCategory = false }: ESGRegulationItemProps) => {
  const { title, content, source, url, published_date, tags, category, impact_level } = regulation;
  
  const getImpactColor = (level?: string) => {
    switch (level) {
      case 'high':
        return "bg-red-100 text-red-800";
      case 'medium':
        return "bg-amber-100 text-amber-800";
      case 'low':
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };
  
  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case 'regulation':
        return "bg-blue-100 text-blue-800";
      case 'reporting_framework':
        return "bg-purple-100 text-purple-800";
      case 'guidance':
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-medium text-base">{title}</h3>
            
            {impact_level && (
              <Badge className={getImpactColor(impact_level)}>
                {impact_level.charAt(0).toUpperCase() + impact_level.slice(1)} impact
              </Badge>
            )}
            
            {showCategory && category && (
              <Badge className={getCategoryColor(category)}>
                {category.replace('_', ' ')}
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{content}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {tags && Array.isArray(tags) && tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className={cn(
                  "cursor-pointer hover:bg-secondary",
                  onTagClick && "hover:bg-secondary/80"
                )}
                onClick={() => onTagClick && onTagClick(tag)}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Source: {source}</span>
              {published_date && <span>• {formatDate(published_date)}</span>}
            </div>
            
            {url && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1 px-2"
                asChild
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                  <span>View Source</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ESGRegulationItem;
