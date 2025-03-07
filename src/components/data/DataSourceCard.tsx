
import { useState } from 'react';
import { Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { useDataSources } from './useDataSources';
import DataSourceList from './DataSourceList';
import DataSourceSearch from './DataSourceSearch';
import DataSourceTabs from './DataSourceTabs';
import DataSourceActions from './DataSourceActions';
import { useDataSourceOperations } from './hooks/useDataSourceOperations';

const DataSourceCard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const { isAuthenticated, user } = useAuth();
  const { dataSources, setDataSources, isLoading } = useDataSources(isAuthenticated, user);
  const { handleUpload, handleConnect, handleAutoProcess } = useDataSourceOperations(
    isAuthenticated, 
    user, 
    setDataSources
  );
  
  const filteredSources = dataSources.filter(source => {
    if (selectedTab !== 'all' && source.category !== selectedTab) {
      return false;
    }
    
    if (searchQuery.trim() !== '') {
      return source.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

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
        <DataSourceSearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <DataSourceTabs 
          selectedTab={selectedTab} 
          onTabChange={setSelectedTab}
        >
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
        </DataSourceTabs>
        
        <DataSourceActions 
          onUpload={handleUpload} 
          onConnect={handleConnect} 
        />
      </CardContent>
    </Card>
  );
};

export default DataSourceCard;
