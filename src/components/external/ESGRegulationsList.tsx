
import { useEffect, useState, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ESGRegulation, regulationsService } from "@/services/external/externalDataService";
import ESGRegulationsTabs from "./ESGRegulationsTabs";
import ESGPagination from "./ESGPagination";
import ESGRegulationsFilters, { RegulationFilters } from "./ESGRegulationsFilters";
import { RegulationImpactLevel } from "./ESGRegulationItem";

const ESGRegulationsList = () => {
  const [regulations, setRegulations] = useState<ESGRegulation[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState<RegulationFilters>({
    tags: [],
    impactLevel: undefined,
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  useEffect(() => {
    const uniqueTags = new Set<string>();
    regulations.forEach(regulation => {
      if (regulation.tags && Array.isArray(regulation.tags)) {
        regulation.tags.forEach(tag => uniqueTags.add(tag));
      }
    });
    setAvailableTags(Array.from(uniqueTags).sort());
  }, [regulations]);
  
  const fetchRegulations = async (pageNum = 1, category?: string, currentFilters = filters) => {
    setIsLoading(true);
    
    try {
      const { data, count } = await regulationsService.getESGRegulations(
        pageNum, 
        pageSize,
        category !== "all" ? category : undefined,
        currentFilters.impactLevel,
        currentFilters.tags.length > 0 ? currentFilters.tags : undefined
      );
      
      setRegulations(data);
      setCount(count);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching regulations:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      await regulationsService.triggerESGScraper();
      await fetchRegulations(1, activeTab !== "all" ? activeTab : undefined);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    fetchRegulations(1, value !== "all" ? value : undefined);
  };
  
  const handlePageChange = (newPage: number) => {
    fetchRegulations(newPage, activeTab !== "all" ? activeTab : undefined);
  };
  
  const handleFilterChange = (newFilters: RegulationFilters) => {
    setFilters(newFilters);
    fetchRegulations(1, activeTab !== "all" ? activeTab : undefined, newFilters);
  };
  
  const handleTagClick = (tag: string) => {
    const newFilters = {
      ...filters,
      tags: filters.tags.includes(tag) ? filters.tags : [...filters.tags, tag]
    };
    setFilters(newFilters);
    fetchRegulations(1, activeTab !== "all" ? activeTab : undefined, newFilters);
  };
  
  const handleClearFilters = () => {
    const clearedFilters = { tags: [], impactLevel: undefined };
    setFilters(clearedFilters);
    fetchRegulations(1, activeTab !== "all" ? activeTab : undefined, clearedFilters);
  };
  
  useEffect(() => {
    fetchRegulations();
  }, []);

  const totalPages = Math.ceil(count / pageSize);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">ESG Regulatory Updates</CardTitle>
            <CardDescription>
              Latest regulatory updates and compliance information
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Updating...' : 'Update Now'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <ESGRegulationsFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          availableTags={availableTags}
          onClearFilters={handleClearFilters}
        />
        
        <ESGRegulationsTabs
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          regulations={regulations}
          isLoading={isLoading}
          handleRefresh={handleRefresh}
          onTagClick={handleTagClick}
        />
      </CardContent>
      
      {count > pageSize && (
        <CardFooter className="flex justify-center">
          <ESGPagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default ESGRegulationsList;
