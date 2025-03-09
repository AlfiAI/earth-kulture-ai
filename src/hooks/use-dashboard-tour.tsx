
import { useState, useEffect } from "react";

type TourStep = {
  target: string;
  title: string;
  content: string;
  placement?: "top" | "right" | "bottom" | "left";
};

const defaultTourSteps: TourStep[] = [
  {
    target: ".dashboard-header",
    title: "ESG Dashboard",
    content: "Welcome to your ESG Dashboard! This is where you can monitor your sustainability performance.",
    placement: "bottom"
  },
  {
    target: ".industry-context-card",
    title: "Industry Context",
    content: "See relevant frameworks, metrics, and regulatory focus specific to your industry.",
    placement: "bottom"
  },
  {
    target: ".dashboard-esg-score",
    title: "ESG Score",
    content: "Track your overall ESG performance score and see how you're doing in each category.",
    placement: "left"
  },
  {
    target: ".carbon-footprint",
    title: "Carbon Footprint",
    content: "Monitor your carbon emissions and track progress toward reduction goals.",
    placement: "right"
  },
  {
    target: ".ai-insights",
    title: "AI Insights",
    content: "Get AI-powered recommendations to improve your sustainability performance.",
    placement: "top"
  }
];

export const useDashboardTour = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourSteps, setTourSteps] = useState<TourStep[]>(defaultTourSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    return localStorage.getItem("dashboard-tour-completed") === "true";
  });

  useEffect(() => {
    // Check if it's the user's first visit
    const hasCompletedTour = localStorage.getItem("dashboard-tour-completed") === "true";
    if (!hasCompletedTour) {
      // Delay the tour a bit to ensure all elements are loaded
      const timeout = setTimeout(() => {
        setIsTourOpen(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, []);

  const startTour = () => {
    setCurrentStep(0);
    setIsTourOpen(true);
  };

  const endTour = () => {
    setIsTourOpen(false);
    localStorage.setItem("dashboard-tour-completed", "true");
    setHasSeenTour(true);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    isTourOpen,
    tourSteps,
    currentStep,
    hasSeenTour,
    startTour,
    endTour,
    nextStep,
    prevStep
  };
};
