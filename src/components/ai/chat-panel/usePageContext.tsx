
import { useState, useEffect } from 'react';
import { esgDataService } from '@/services/esgDataService';
import { externalDataService } from '@/services/external/externalDataService';

/**
 * A hook to load relevant page context data based on the current path
 */
export function usePageContext(isOpen: boolean, currentPath: string = '/') {
  const [pageContext, setPageContext] = useState<any>(null);

  useEffect(() => {
    const loadPageContext = async () => {
      try {
        let contextData = {};
        
        if (currentPath.includes('analytics')) {
          const esgData = await esgDataService.getAllESGData();
          const emissions = await esgDataService.getCarbonEmissions();
          contextData = {
            type: 'analytics',
            esgData: esgData.slice(0, 5), // Limit data size
            emissions: emissions.slice(0, 5),
            carbonFootprint: esgDataService.calculateCarbonFootprint(emissions)
          };
        } else if (currentPath.includes('benchmark')) {
          const benchmarks = await externalDataService.fetchBenchmarks();
          contextData = {
            type: 'benchmarking',
            benchmarks: benchmarks.slice(0, 3)
          };
        } else if (currentPath.includes('compliance')) {
          const frameworks = await esgDataService.getComplianceFrameworks();
          contextData = {
            type: 'compliance',
            frameworks: frameworks.slice(0, 3)
          };
        } else if (currentPath.includes('about')) {
          contextData = {
            type: 'about',
            platformInfo: {
              name: 'Waly ESG Platform',
              capabilities: [
                'Advanced ESG analytics',
                'Carbon footprint tracking',
                'Regulatory compliance monitoring',
                'AI-powered insights and recommendations'
              ]
            }
          };
        }
        
        setPageContext(contextData);
      } catch (error) {
        console.error('Error loading page context:', error);
      }
    };
    
    if (isOpen) {
      loadPageContext();
    }
  }, [isOpen, currentPath]);

  return pageContext;
}
