
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ESGRegulation, regulationsService } from "@/services/external/externalDataService";
import ESGRegulationsTabs from "./ESGRegulationsTabs";
import ESGPagination from "./ESGPagination";

const ESGRegulationsList = () => {
  const [regulations, setRegulations] = useState<ESGRegulation[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const fetchRegulations = async (pageNum = 1, category?: string) => {
    setIsLoading(true);
    
    try {
      const { data, count } = await regulationsService.getESGRegulations(
        pageNum, 
        pageSize,
        category !== "all" ? category : undefined
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
      // Refetch the data after update
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
  
  useEffect(() => {
    fetchRegulations();
  }, []);

  // Calculate the total number of pages
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
        <ESGRegulationsTabs
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          regulations={regulations}
          isLoading={isLoading}
          handleRefresh={handleRefresh}
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
