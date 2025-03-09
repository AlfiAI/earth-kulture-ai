
import { useState, useCallback, useEffect } from "react";
import { RegulationFilters } from "@/components/external/ESGRegulationsFilters";
import { toast } from "sonner";
import { externalDataService } from "@/services/external/externalDataService";
import { RegulationImpactLevel } from "@/components/external/ESGRegulationItem";

export interface ExternalDataState {
  searchTerm: string;
  filters: RegulationFilters;
  category: string;
  page: number;
  isLoading: boolean;
}

export function useExternalData() {
  const [state, setState] = useState<ExternalDataState>({
    searchTerm: "",
    filters: {
      tags: [],
      impactLevel: undefined
    },
    category: "all",
    page: 1,
    isLoading: false
  });

  // Handle search term changes
  const handleSearch = useCallback((term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }));
    console.log("Searching for:", term);
    // In a real app, this would trigger a search across the data
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((filters: RegulationFilters) => {
    setState(prev => ({ ...prev, filters }));
  }, []);

  // Handle category/tab changes
  const handleCategoryChange = useCallback((category: string) => {
    setState(prev => ({ ...prev, category, page: 1 }));
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: { tags: [], impactLevel: undefined }
    }));
  }, []);

  // Handle specific tag selection
  const handleTagSelection = useCallback((tag: string) => {
    setState(prev => {
      const tagExists = prev.filters.tags.includes(tag);
      const newTags = tagExists 
        ? prev.filters.tags.filter(t => t !== tag)
        : [...prev.filters.tags, tag];
      
      return {
        ...prev,
        filters: {
          ...prev.filters,
          tags: newTags
        }
      };
    });
  }, []);

  // Handle impact level selection
  const handleImpactLevelChange = useCallback((impactLevel?: RegulationImpactLevel) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        impactLevel
      }
    }));
  }, []);

  // Function to fetch external data
  const fetchData = useCallback(async (type: 'regulations' | 'benchmarks' | 'datasets' = 'regulations') => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      let data;
      
      switch (type) {
        case 'regulations':
          data = await externalDataService.fetchRegulations();
          break;
        case 'benchmarks':
          data = await externalDataService.fetchBenchmarks();
          break;
        case 'datasets':
          // This would need to be implemented in the service
          data = [];
          break;
      }
      
      console.log(`Fetched ${type} data:`, data);
      // In a real implementation, you would update some state with the fetched data
      
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      toast.error(`Failed to load ${type} data`);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  return {
    ...state,
    handleSearch,
    handleFilterChange,
    handleCategoryChange,
    handlePageChange,
    clearFilters,
    handleTagSelection,
    handleImpactLevelChange,
    fetchData
  };
}
