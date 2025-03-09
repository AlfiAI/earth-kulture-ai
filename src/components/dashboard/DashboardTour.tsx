
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDashboardTour } from "@/hooks/use-dashboard-tour";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DashboardTour: React.FC = () => {
  const { 
    isTourOpen, 
    tourSteps, 
    currentStep, 
    hasSeenTour,
    startTour, 
    endTour, 
    nextStep, 
    prevStep 
  } = useDashboardTour();

  const [targetPosition, setTargetPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (isTourOpen && tourSteps[currentStep]) {
      const updatePosition = () => {
        const targetElement = document.querySelector(tourSteps[currentStep].target);
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          setTargetPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
          });

          // Scroll target into view if needed
          if (
            rect.top < 0 || 
            rect.left < 0 || 
            rect.bottom > window.innerHeight || 
            rect.right > window.innerWidth
          ) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }
        }
      };

      updatePosition();
      window.addEventListener("resize", updatePosition);
      return () => window.removeEventListener("resize", updatePosition);
    }
  }, [isTourOpen, currentStep, tourSteps]);

  if (!isTourOpen) {
    return (
      <Button
        onClick={startTour}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 gap-2 z-50 shadow-md"
      >
        <HelpCircle size={16} />
        {hasSeenTour ? "Restart Tour" : "Take a Tour"}
      </Button>
    );
  }

  const step = tourSteps[currentStep];
  if (!step || !targetPosition) return null;

  const getTooltipPosition = () => {
    const placement = step.placement || "bottom";
    const spacing = 12;

    switch (placement) {
      case "top":
        return {
          top: targetPosition.top - spacing,
          left: targetPosition.left + targetPosition.width / 2,
          transform: "translate(-50%, -100%)"
        };
      case "right":
        return {
          top: targetPosition.top + targetPosition.height / 2,
          left: targetPosition.left + targetPosition.width + spacing,
          transform: "translateY(-50%)"
        };
      case "left":
        return {
          top: targetPosition.top + targetPosition.height / 2,
          left: targetPosition.left - spacing,
          transform: "translate(-100%, -50%)"
        };
      case "bottom":
      default:
        return {
          top: targetPosition.top + targetPosition.height + spacing,
          left: targetPosition.left + targetPosition.width / 2,
          transform: "translateX(-50%)"
        };
    }
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={endTour}></div>

      {/* Highlight overlay */}
      <div
        className="absolute border-2 border-primary rounded-md z-40 pointer-events-none"
        style={{
          top: targetPosition.top - 4,
          left: targetPosition.left - 4,
          width: targetPosition.width + 8,
          height: targetPosition.height + 8,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.4)"
        }}
      ></div>

      <AnimatePresence>
        <motion.div 
          className="fixed z-50 bg-card text-card-foreground border rounded-lg shadow-lg p-4 max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: tooltipPosition.transform
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={endTour}
            >
              <X size={16} />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">{step.content}</p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {tourSteps.length}
            </div>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={prevStep}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  Back
                </Button>
              )}
              
              <Button 
                onClick={nextStep}
                size="sm"
                className="flex items-center gap-1"
              >
                {currentStep < tourSteps.length - 1 ? (
                  <>
                    Next
                    <ChevronRight size={16} />
                  </>
                ) : (
                  "Finish"
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default DashboardTour;
