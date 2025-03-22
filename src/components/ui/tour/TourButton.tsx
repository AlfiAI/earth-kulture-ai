
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useTour } from "@/hooks/use-tour";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";

interface TourButtonProps extends ButtonProps {
  showIcon?: boolean;
  showLabel?: boolean;
  dropdownMenu?: boolean;
}

const TourButton: React.FC<TourButtonProps> = ({
  showIcon = true,
  showLabel = true,
  dropdownMenu = false,
  className,
  ...props
}) => {
  const { startTour, resetPageTour, resetAllTours } = useTour();
  const location = useLocation();
  const pageNames: Record<string, string> = {
    "/": "Dashboard",
    "/analytics": "Analytics",
    "/compliance": "Compliance",
    "/insights": "Insights",
    "/benchmarking": "Benchmarking",
    "/data": "Data Center",
    "/external-data": "External Data",
    "/ai-assistant": "AI Assistant",
    "/goals": "Goals"
  };
  
  const currentPageName = pageNames[location.pathname] || "This Page";

  if (dropdownMenu) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={className}
            {...props}
          >
            {showIcon && <HelpCircle className="h-4 w-4 mr-2" />}
            {showLabel && "Guide Me"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Tour Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => startTour()}>
            Start {currentPageName} Tour
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => resetPageTour()}>
            Reset {currentPageName} Tour
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => resetAllTours()}>
            Reset All Tours
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={startTour}
      className={className}
      {...props}
    >
      {showIcon && <HelpCircle className="h-4 w-4 mr-2" />}
      {showLabel && "Guide Me"}
    </Button>
  );
};

export default TourButton;
