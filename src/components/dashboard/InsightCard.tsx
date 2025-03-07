
import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, Lightbulb, Info, BarChart2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type InsightType = 'trend' | 'recommendation' | 'alert' | 'info';

interface InsightCardProps {
  type: InsightType;
  title: string;
  description: string;
  indicator?: 'up' | 'down' | 'neutral';
  percentageChange?: number;
  date?: string;
  onClick?: () => void;
}

const InsightCard = ({
  type,
  title,
  description,
  indicator,
  percentageChange = 0,
  date,
  onClick,
}: InsightCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const getIcon = () => {
    switch (type) {
      case 'trend':
        return <BarChart2 className="h-4 w-4" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getBadgeColor = () => {
    switch (type) {
      case 'trend':
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'recommendation':
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'alert':
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case 'info':
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden border-l-4 animate-in slide-up bg-background shadow-sm hover:shadow transition-all duration-300",
        type === 'trend' && "border-l-sky-500",
        type === 'recommendation' && "border-l-green-500",
        type === 'alert' && "border-l-amber-500",
        type === 'info' && "border-l-slate-500",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              type === 'trend' && "bg-sky-100",
              type === 'recommendation' && "bg-green-100",
              type === 'alert' && "bg-amber-100",
              type === 'info' && "bg-slate-100",
            )}>
              {getIcon()}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">{title}</h3>
                
                <Badge 
                  variant="outline" 
                  className={cn("text-xs font-normal", getBadgeColor())}
                >
                  {type === 'trend' ? 'Trend' : 
                   type === 'recommendation' ? 'Recommendation' : 
                   type === 'alert' ? 'Alert' : 'Info'}
                </Badge>
              </div>
              
              <p className={cn(
                "mt-1 text-sm text-muted-foreground text-balance",
                expanded ? "line-clamp-none" : "line-clamp-2"
              )}>
                {description}
              </p>
              
              {date && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {date}
                </p>
              )}
            </div>
          </div>
          
          {indicator && percentageChange !== undefined && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "flex items-center space-x-1 text-xs font-medium",
                    indicator === 'up' ? "text-green-600" : 
                    indicator === 'down' ? "text-red-600" : 
                    "text-slate-600"
                  )}>
                    {indicator === 'up' ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : indicator === 'down' ? (
                      <ArrowDownIcon className="h-3 w-3" />
                    ) : null}
                    <span>{Math.abs(percentageChange)}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-xs">
                    {indicator === 'up' ? 'Increase' : 'Decrease'} of {Math.abs(percentageChange)}% from previous period
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3">
          {description.length > 120 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-0 text-xs h-auto"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show less' : 'Show more'}
            </Button>
          )}
          
          {onClick && (
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto text-xs"
              onClick={onClick}
            >
              View details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
