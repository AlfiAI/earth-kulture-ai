import { useState } from 'react';
import { Database, RefreshCw, Upload, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DataSourceList from './DataSourceList';
import { useDataSources } from './useDataSources';

const DataSourceCard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const { isAuthenticated, user } = useAuth();
  const { dataSources, setDataSources, isLoading } = useDataSources(isAuthenticated, user);
  
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
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to upload data');
      return;
    }
    
    toast.info('Upload functionality would store files in Supabase Storage in a complete implementation');
  };
  
  const handleConnect = async () => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to connect a data source');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('data_sources')
        .insert({
          user_id: user.id,
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
      
      if (data) {
        toast.success('Successfully connected new data source');
        
        const newDataSource = {
          id: data.id,
          name: data.name,
          category: data.category,
          lastUpdated: data.last_updated ? new Date(data.last_updated).toISOString().split('T')[0] : '',
          status: data.status as 'active' | 'needs-update',
          format: data.format,
          recordCount: data.record_count || 0
        };
        
        setDataSources(prev => [newDataSource, ...prev]);
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
        } as any)
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
