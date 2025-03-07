
import { useState } from 'react';
import { 
  Database, 
  RefreshCw, 
  Upload, 
  Download, 
  FileSpreadsheet,
  PlusCircle,
  Filter,
  ShieldCheck
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import WalyAssistant from "@/components/ai/WalyAssistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import DataValidation from "@/components/data/DataValidation";

const DataCenter = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  // Sample data sources
  const dataSources = [
    {
      id: '1',
      name: 'Energy Consumption',
      category: 'environmental',
      lastUpdated: '2023-08-15',
      status: 'active',
      format: 'excel',
      recordCount: 1245
    },
    {
      id: '2',
      name: 'Water Usage',
      category: 'environmental',
      lastUpdated: '2023-08-10',
      status: 'active',
      format: 'csv',
      recordCount: 890
    },
    {
      id: '3',
      name: 'GHG Emissions',
      category: 'carbon',
      lastUpdated: '2023-08-05',
      status: 'active',
      format: 'excel',
      recordCount: 1520
    },
    {
      id: '4',
      name: 'Supplier Data',
      category: 'supply-chain',
      lastUpdated: '2023-07-28',
      status: 'needs-update',
      format: 'csv',
      recordCount: 342
    },
    {
      id: '5',
      name: 'Waste Management',
      category: 'environmental',
      lastUpdated: '2023-07-25',
      status: 'active',
      format: 'excel',
      recordCount: 765
    },
    {
      id: '6',
      name: 'Employee Demographics',
      category: 'social',
      lastUpdated: '2023-07-20',
      status: 'active',
      format: 'excel',
      recordCount: 412
    }
  ];
  
  const filteredSources = dataSources.filter(source => {
    if (selectedTab !== 'all' && source.category !== selectedTab) {
      return false;
    }
    
    if (searchQuery.trim() !== '') {
      return source.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });
  
  const handleUpload = () => {
    toast.info('Upload functionality would connect to API integration in a complete implementation');
  };
  
  const handleConnect = () => {
    toast.info('This would open an API connection wizard in a complete implementation');
  };
  
  const handleAutoProcess = (sourceId: string) => {
    toast.loading('AI is processing data source...');
    
    setTimeout(() => {
      toast.success('Data source processed successfully by AI');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-16",
        isMobile && "ml-0"
      )}>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="container max-w-7xl mx-auto p-4 lg:p-6 pb-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Data Management</h1>
              <p className="text-muted-foreground">AI-powered data processing for ESG & carbon tracking</p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Button>
              <Button size="sm" className="h-9 gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>Connect API</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Sources
                </CardTitle>
                <CardDescription>
                  Manage and process your ESG & carbon data sources
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex-1">
                    <Label htmlFor="search-data" className="sr-only">Search</Label>
                    <Input
                      id="search-data"
                      placeholder="Search data sources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                
                <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="environmental">Environmental</TabsTrigger>
                    <TabsTrigger value="carbon">Carbon</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={selectedTab} className="pt-2">
                    <div className="space-y-3">
                      {filteredSources.length > 0 ? (
                        filteredSources.map((source) => (
                          <div key={source.id} className="border rounded-md p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium flex items-center">
                                  <FileSpreadsheet className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {source.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  Last updated: {source.lastUpdated} • {source.recordCount} records
                                </p>
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                source.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {source.status === 'active' ? 'Active' : 'Needs Update'}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs"
                                onClick={() => handleAutoProcess(source.id)}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Auto-Process
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Export
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No data sources found</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-4 pt-4 border-t flex justify-between">
                  <Button variant="outline" onClick={handleUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Data
                  </Button>
                  <Button onClick={handleConnect}>
                    <Database className="h-4 w-4 mr-2" />
                    Connect Data Source
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <DataValidation />
          </div>
        </main>
      </div>
      
      <WalyAssistant initialOpen={false} />
    </div>
  );
};

export default DataCenter;
