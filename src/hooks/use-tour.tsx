
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

export type TourPlacement = "top" | "right" | "bottom" | "left";

export type TourStep = {
  target: string;
  title: string;
  content: string;
  placement?: TourPlacement;
};

// Tour steps for each page route
const pageTourSteps: Record<string, TourStep[]> = {
  // Dashboard tour
  "/": [
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
  ],
  
  // Analytics page tour
  "/analytics": [
    {
      target: ".metrics-section",
      title: "Analytics Overview",
      content: "Get a quick overview of your key ESG metrics and performance indicators.",
      placement: "bottom"
    },
    {
      target: ".chart-tabs",
      title: "Interactive Charts",
      content: "Explore detailed charts and graphs to visualize your ESG data.",
      placement: "top"
    },
    {
      target: ".predictive-insights",
      title: "AI Predictions",
      content: "See AI-powered predictions about future trends and potential impacts.",
      placement: "left"
    }
  ],
  
  // Compliance page tour
  "/compliance": [
    {
      target: ".compliance-header",
      title: "Compliance Dashboard",
      content: "Track your regulatory compliance status across different frameworks and standards.",
      placement: "bottom"
    },
    {
      target: ".compliance-summary",
      title: "Compliance Summary",
      content: "Get a quick overview of your compliance status and any pending issues.",
      placement: "right"
    },
    {
      target: ".compliance-tabs",
      title: "Compliance Categories",
      content: "Dive into specific compliance categories and requirements.",
      placement: "top"
    }
  ],
  
  // Insights page tour
  "/insights": [
    {
      target: ".insights-header",
      title: "AI Insights Hub",
      content: "Welcome to your AI-powered insights dashboard for sustainability intelligence.",
      placement: "bottom"
    },
    {
      target: ".insights-banner",
      title: "Featured Insights",
      content: "View highlighted insights and recommendations from our AI analysis.",
      placement: "bottom"
    },
    {
      target: ".insights-content",
      title: "Detailed Analysis",
      content: "Explore in-depth analysis and recommendations to improve your ESG performance.",
      placement: "top"
    }
  ],
  
  // Benchmarking page tour
  "/benchmarking": [
    {
      target: ".ai-benchmark-report",
      title: "AI Benchmarking",
      content: "Compare your performance against industry standards and competitors.",
      placement: "right"
    },
    {
      target: ".industry-comparison",
      title: "Industry Context",
      content: "See how your performance compares to industry averages and leaders.",
      placement: "bottom"
    },
    {
      target: ".benchmark-simulator",
      title: "Simulation Tools",
      content: "Use our simulator to model potential changes and predict their impact.",
      placement: "left"
    }
  ],
  
  // Data Center page tour
  "/data": [
    {
      target: ".data-header",
      title: "Data Management",
      content: "This is your data center for managing all your ESG data sources and connections.",
      placement: "bottom"
    },
    {
      target: ".data-source-card",
      title: "Data Sources",
      content: "Manage your connected data sources and add new ones.",
      placement: "top"
    },
    {
      target: ".data-validation",
      title: "Data Validation",
      content: "Ensure your data is accurate and ready for ESG reporting and analysis.",
      placement: "right"
    }
  ],
  
  // External Data page tour
  "/external-data": [
    {
      target: ".external-data-header",
      title: "External Data",
      content: "Access external ESG data sources, benchmarks, and regulatory information.",
      placement: "bottom"
    },
    {
      target: ".external-data-search",
      title: "Data Search",
      content: "Search for specific external data related to your industry or interests.",
      placement: "top"
    },
    {
      target: "tabs",
      title: "Data Categories",
      content: "Explore different categories of external ESG data.",
      placement: "top"
    }
  ],
  
  // AI Assistant page tour
  "/ai-assistant": [
    {
      target: ".ai-assistant-header",
      title: "AI Assistant",
      content: "Your personal AI assistant for all ESG and sustainability questions.",
      placement: "bottom"
    },
    {
      target: ".welcome-card",
      title: "Getting Started",
      content: "Learn how to effectively use the AI assistant and see suggested queries.",
      placement: "top"
    },
    {
      target: ".ai-assistant-tabs",
      title: "Assistant Features",
      content: "Access different features of your AI assistant, including chat and insights.",
      placement: "right"
    }
  ],
  
  // Goals page tour
  "/goals": [
    {
      target: "h1",
      title: "Sustainability Goals",
      content: "Set, track, and manage your organization's sustainability goals and targets.",
      placement: "bottom"
    },
    {
      target: ".tabsList",
      title: "Goals Navigation",
      content: "Switch between different views of your sustainability goals.",
      placement: "top"
    },
    {
      target: ".sustainability-goals",
      title: "Goal Management",
      content: "View and update your current sustainability goals and their progress.",
      placement: "right"
    }
  ]
};

export const useTour = () => {
  const location = useLocation();
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState<Record<string, boolean>>(() => {
    const savedState = localStorage.getItem("page-tours-completed");
    return savedState ? JSON.parse(savedState) : {};
  });

  // Get the current page path
  const currentPath = location.pathname;
  
  // Default to dashboard if no tour steps found for current path
  const routeKey = Object.keys(pageTourSteps).find(path => 
    currentPath === path || 
    (path !== "/" && currentPath.startsWith(path))
  ) || "/";
  
  // Get tour steps for current page
  const tourSteps = pageTourSteps[routeKey] || [];

  useEffect(() => {
    // Check if it's the user's first visit to this page
    const hasCompletedPageTour = hasSeenTour[currentPath];
    
    if (tourSteps.length > 0 && !hasCompletedPageTour) {
      // Delay the tour a bit to ensure all elements are loaded
      const timeout = setTimeout(() => {
        setIsTourOpen(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentPath, hasSeenTour, tourSteps.length]);

  const startTour = () => {
    setCurrentStep(0);
    setIsTourOpen(true);
  };

  const endTour = () => {
    setIsTourOpen(false);
    
    // Mark this page's tour as completed
    const updatedTours = { ...hasSeenTour, [currentPath]: true };
    localStorage.setItem("page-tours-completed", JSON.stringify(updatedTours));
    setHasSeenTour(updatedTours);
    
    toast.success("Tour completed! You can restart it anytime from the header.");
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

  const resetPageTour = (pagePath?: string) => {
    const pathToReset = pagePath || currentPath;
    const updatedTours = { ...hasSeenTour };
    delete updatedTours[pathToReset];
    localStorage.setItem("page-tours-completed", JSON.stringify(updatedTours));
    setHasSeenTour(updatedTours);
    
    if (pathToReset === currentPath) {
      startTour();
    }
  };

  const resetAllTours = () => {
    localStorage.removeItem("page-tours-completed");
    setHasSeenTour({});
    startTour();
    toast.success("All tours have been reset");
  };

  return {
    isTourOpen,
    tourSteps,
    currentStep,
    hasSeenTour: hasSeenTour[currentPath],
    startTour,
    endTour,
    nextStep,
    prevStep,
    resetPageTour,
    resetAllTours
  };
};
