
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, ExternalLink, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { externalDataService, ESGRegulation } from "@/services/external/externalDataService";

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
      const { data, count } = await externalDataService.getESGRegulations(
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
      await externalDataService.triggerESGScraper();
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
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include page 1
      pages.push(1);
      
      // Calculate start and end of middle pages
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);
      
      // Adjust if we're at the start or end
      if (page <= 2) {
        end = Math.min(4, totalPages - 1);
      } else if (page >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis after page 1 if needed
      if (start > 2) {
        pages.push('ellipsis');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }
      
      // Always include last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
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
        <Tabs defaultValue="all" onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Updates</TabsTrigger>
            <TabsTrigger value="regulation">Regulations</TabsTrigger>
            <TabsTrigger value="reporting_framework">Frameworks</TabsTrigger>
            <TabsTrigger value="guidance">Guidance</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">Loading regulatory updates...</p>
              </div>
            ) : regulations.length > 0 ? (
              <div className="space-y-4">
                {regulations.map((regulation) => (
                  <div 
                    key={regulation.id} 
                    className="p-4 border rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{regulation.title}</h3>
                      <Badge 
                        variant={
                          regulation.impact_level === 'high' 
                            ? 'destructive' 
                            : regulation.impact_level === 'medium' 
                              ? 'default' 
                              : 'outline'
                        }
                      >
                        {regulation.impact_level || 'Unknown'} Impact
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <span className="mr-2">Source: {regulation.source}</span>
                      {regulation.published_date && (
                        <span>
                          • Published: {new Date(regulation.published_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {regulation.content}
                    </p>
                    
                    <div className="flex items-center">
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0"
                        asChild
                      >
                        <a 
                          href={regulation.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          Read More
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                      
                      {regulation.tags && regulation.tags.length > 0 && (
                        <div className="ml-auto flex gap-1">
                          {regulation.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No regulatory updates available</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={handleRefresh}
                >
                  Refresh Data
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {count > pageSize && (
        <CardFooter className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
                </PaginationItem>
              )}
              
              {getPageNumbers().map((pageNum, index) => (
                <PaginationItem key={index}>
                  {pageNum === 'ellipsis' ? (
                    <span className="flex h-9 w-9 items-center justify-center">...</span>
                  ) : (
                    <PaginationLink 
                      isActive={pageNum === page}
                      onClick={() => handlePageChange(Number(pageNum))}
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext onClick={() => handlePageChange(page + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );
};

export default ESGRegulationsList;
