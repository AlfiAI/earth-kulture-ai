
import { useState } from 'react';
import { 
  Database, 
  RefreshCw, 
  Upload, 
  Filter, 
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface DataSource {
  id: string;
  name: string;
  category: string;
  lastUpdated: string;
  status: 'active' | 'needs-update';
  format: string;
  recordCount: number;
}

const DataSourceCard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  
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
            <DataSourceList 
              sources={filteredSources} 
              onAutoProcess={handleAutoProcess} 
            />
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
  );
};

export default DataSourceCard;

interface DataSourceListProps {
  sources: DataSource[];
  onAutoProcess: (id: string) => void;
}

const DataSourceList = ({ sources, onAutoProcess }: DataSourceListProps) => {
  return (
    <div className="space-y-3">
      {sources.length > 0 ? (
        sources.map((source) => (
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
                onClick={() => onAutoProcess(source.id)}
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
  );
};
