import { useState, useEffect } from 'react';
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    const fetchDataSources = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        const { data: user } = await supabase.auth.getUser();
        
        if (!user.user) {
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('data_sources')
          .select('*')
          .eq('user_id', user.user.id)
          .order('last_updated', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const formattedData: DataSource[] = data.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            lastUpdated: new Date(item.last_updated).toISOString().split('T')[0],
            status: item.status as 'active' | 'needs-update',
            format: item.format,
            recordCount: item.record_count || 0
          }));
          
          setDataSources(formattedData);
        } else {
          setDataSources([
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
          ]);
        }
      } catch (error) {
        console.error('Error fetching data sources:', error);
        toast.error('Failed to load data sources');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDataSources();
  }, [isAuthenticated, user]);
  
  const filteredSources = dataSources.filter(source => {
    if (selectedTab !== 'all' && source.category !== selectedTab) {
      return false;
    }
    
    if (searchQuery.trim() !== '') {
      return source.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });
  
  const handleUpload = async () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to upload data');
      return;
    }
    
    toast.info('Upload functionality would store files in Supabase Storage in a complete implementation');
  };
  
  const handleConnect = async () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to connect a data source');
      return;
    }
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast.error('Authentication error');
        return;
      }
      
      const { data, error } = await supabase
        .from('data_sources')
        .insert({
          user_id: user.user.id,
          name: 'New API Connection',
          category: 'environmental',
          format: 'api',
          status: 'active',
          record_count: 0
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast.success('Successfully connected new data source');
      
      const { data: dataSources, error: refreshError } = await supabase
        .from('data_sources')
        .select('*')
        .eq('user_id', user.user.id)
        .order('last_updated', { ascending: false });
        
      if (refreshError) {
        throw refreshError;
      }
      
      if (dataSources) {
        const formattedData: DataSource[] = dataSources.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          lastUpdated: new Date(item.last_updated).toISOString().split('T')[0],
          status: item.status as 'active' | 'needs-update',
          format: item.format,
          recordCount: item.record_count || 0
        }));
        
        setDataSources(formattedData);
      }
    } catch (error) {
      console.error('Error connecting data source:', error);
      toast.error('Failed to connect data source');
    }
  };
  
  const handleAutoProcess = async (sourceId: string) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to process data');
      return;
    }
    
    toast.loading('AI is processing data source...');
    
    try {
      const { error } = await supabase
        .from('data_sources')
        .update({
          last_updated: new Date().toISOString(),
          status: 'active'
        })
        .eq('id', sourceId);
        
      if (error) {
        throw error;
      }
      
      setTimeout(() => {
        toast.success('Data source processed successfully by AI');
      }, 2000);
    } catch (error) {
      console.error('Error processing data source:', error);
      toast.error('Failed to process data source');
    }
  };

  const handleRefresh = () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to refresh data');
      return;
    }
    
    toast.loading('Refreshing data sources...');
    
    const fetchDataSources = async () => {
      try {
        const { data, error } = await supabase
          .from('data_sources')
          .select('*')
          .eq('user_id', user.user.id)
          .order('last_updated', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedData: DataSource[] = data.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            lastUpdated: new Date(item.last_updated).toISOString().split('T')[0],
            status: item.status as 'active' | 'needs-update',
            format: item.format,
            recordCount: item.record_count || 0
          }));
          
          setDataSources(formattedData);
        }
        
        toast.success('Data sources refreshed');
      } catch (error) {
        console.error('Error refreshing data sources:', error);
        toast.error('Failed to refresh data sources');
      }
    };
    
    fetchDataSources();
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
          <Button variant="outline" size="sm" onClick={handleRefresh}>
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
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading data sources...</p>
              </div>
            ) : (
              <DataSourceList 
                sources={filteredSources} 
                onAutoProcess={handleAutoProcess} 
              />
            )}
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
