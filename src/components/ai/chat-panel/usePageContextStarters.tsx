
import { TrendingUp, BarChart, Zap, Lightbulb, LineChart, Shield, FileText, Table } from 'lucide-react';
import { ReactNode } from 'react';

type StarterItem = {
  text: string;
  icon: ReactNode;
};

/**
 * A hook to get context-aware conversation starters based on the current page path
 */
export function usePageContextStarters(currentPath?: string): StarterItem[] {
  if (currentPath?.includes('analytics')) {
    return [
      {
        text: "Explain my emissions trend data",
        icon: <LineChart className="h-4 w-4 text-sky-500" />
      },
      {
        text: "Generate ESG performance summary",
        icon: <BarChart className="h-4 w-4 text-emerald-500" />
      },
      {
        text: "Identify areas for improvement",
        icon: <Zap className="h-4 w-4 text-amber-500" />
      },
      {
        text: "Recommend key metrics to track",
        icon: <Table className="h-4 w-4 text-purple-500" />
      }
    ];
  } else if (currentPath?.includes('benchmark')) {
    return [
      {
        text: "Compare me to industry leaders",
        icon: <TrendingUp className="h-4 w-4 text-sky-500" />
      },
      {
        text: "Generate competitive analysis",
        icon: <BarChart className="h-4 w-4 text-emerald-500" />
      },
      {
        text: "Simulate future performance trends",
        icon: <LineChart className="h-4 w-4 text-amber-500" />
      },
      {
        text: "Recommend improvement strategies",
        icon: <Lightbulb className="h-4 w-4 text-purple-500" />
      }
    ];
  } else if (currentPath?.includes('compliance')) {
    return [
      {
        text: "Explain CSRD requirements",
        icon: <Shield className="h-4 w-4 text-sky-500" />
      },
      {
        text: "Summarize upcoming regulations",
        icon: <FileText className="h-4 w-4 text-emerald-500" />
      },
      {
        text: "Assess my compliance gaps",
        icon: <Zap className="h-4 w-4 text-amber-500" />
      },
      {
        text: "Create compliance roadmap",
        icon: <Lightbulb className="h-4 w-4 text-purple-500" />
      }
    ];
  } else {
    // Default starters
    return [
      {
        text: "Analyze my sustainability progress",
        icon: <TrendingUp className="h-4 w-4 text-sky-500" />
      },
      {
        text: "Generate ESG performance forecast",
        icon: <BarChart className="h-4 w-4 text-emerald-500" />
      },
      {
        text: "Identify compliance risk areas",
        icon: <Zap className="h-4 w-4 text-amber-500" />
      },
      {
        text: "Suggest optimization strategies",
        icon: <Lightbulb className="h-4 w-4 text-purple-500" />
      }
    ];
  }
}

/**
 * Get a placeholder text based on current path
 */
export function getContextPlaceholder(currentPath?: string): string {
  return currentPath?.includes('analytics') 
    ? 'Ask about your ESG metrics and performance...' 
    : currentPath?.includes('benchmark') 
    ? 'Ask about industry benchmarks and competition...'
    : currentPath?.includes('compliance') 
    ? 'Ask about regulations and requirements...'
    : 'Ask about sustainability, ESG, and carbon management...';
}
