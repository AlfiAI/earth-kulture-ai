
import { useLocation } from 'react-router-dom';

/**
 * Hook to provide context-aware conversation starter suggestions based on current route
 */
export const useContextAwareStarters = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const getContextAwareStarters = () => {
    if (currentPath.includes('analytics')) {
      return [
        "Explain this chart data",
        "How can I improve my ESG score?",
        "What trends do you see in my emissions?",
        "Recommend KPIs for my dashboard"
      ];
    } else if (currentPath.includes('benchmark')) {
      return [
        "How do I compare to industry peers?",
        "What's a good carbon intensity target?",
        "Explain my competitive position",
        "Suggest benchmarking improvements"
      ];
    } else if (currentPath.includes('compliance')) {
      return [
        "Explain CSRD requirements",
        "Am I at risk of non-compliance?",
        "Summarize upcoming regulations",
        "How to prepare for SEC climate rules"
      ];
    } else if (currentPath.includes('about')) {
      return [
        "What makes your platform unique?",
        "How do you handle data security?",
        "Tell me about your ESG expertise",
        "What industry standards do you support?"
      ];
    } else {
      // Default starters
      return [
        "How can I improve my ESG score?",
        "Explain carbon footprint tracking",
        "What ESG metrics should I monitor?",
        "How to start sustainability reporting?"
      ];
    }
  };

  return { getContextAwareStarters };
};
