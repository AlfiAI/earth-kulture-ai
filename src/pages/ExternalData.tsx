
import { useState, useEffect } from 'react';
import { Globe, Database, ListFilter, Calendar, RefreshCw } from 'lucide-react';
import ESGRegulationsList from "@/components/external/ESGRegulationsList";
import ESGBenchmarkCard from "@/components/external/ESGBenchmarkCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import InsightsLayout from "@/components/insights/InsightsLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { externalDataService } from "@/services/external/externalDataService";

const DataSourceHealth = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        // In a real implementation, this would fetch from Supabase
        // For now, providing sample data
        setTimeout(() => {
          setDataSources([
            { name: 'Regulatory Updates', status: 'healthy', last_updated: '2023-10-15', record_count: 128, health_score: 95 },
            { name: 'Carbon Emissions Data', status: 'healthy', last_updated: '2023-10-12', record_count: 245, health_score: 90 },
            { name: 'ESG Ratings', status: 'needs_update', last_updated: '2023-09-20', record_count: 87, health_score: 72 },
            { name: 'Industry Benchmarks', status: 'healthy', last_updated: '2023-10-14', record_count: 56, health_score: 88 },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data sources:", error);
        setIsLoading(false);
      }
    };
    
    fetchDataSources();
  }, []);
  
  const handleRefreshSources = async () => {
    setIsRefreshing(true);
    
    try {
      // Call our Supabase functions
      const regulations = await externalDataService.fetchRegulations();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for UI feedback
      
      toast.success("Data sources refreshed successfully");
      // Update the last_updated timestamp for our sources
      const updatedSources = dataSources.map(source => ({
        ...source,
        last_updated: new Date().toISOString().split('T')[0],
        status: 'healthy',
        health_score: Math.min(source.health_score + 5, 100)
      }));
      
      setDataSources(updatedSources);
    } catch (error) {
      console.error("Error refreshing data sources:", error);
      toast.error("Failed to refresh data sources");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-xl">ESG Data Sources</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshSources}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh All'}
          </Button>
        </div>
        <CardDescription>
          Monitor and manage your external ESG data connections
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {dataSources.map((source, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">{source.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {source.last_updated} • {source.record_count} records
                  </p>
                  <div className="mt-2 mb-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Data Health</span>
                      <span>{source.health_score}%</span>
                    </div>
                    <Progress value={source.health_score} className="h-1.5" />
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  source.status === 'healthy' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                } mt-2 sm:mt-0 inline-block`}>
                  {source.status === 'healthy' ? 'Healthy' : 'Needs Update'}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            Data is automatically refreshed daily. Last automated refresh was 
            {isLoading ? <Skeleton className="inline-block h-3 w-24 mx-1" /> : ' today at 3:00 AM UTC.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const ExternalData = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <InsightsLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <Globe className="h-6 w-6 mr-2 flex-shrink-0" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">External ESG Data</h1>
            <p className="text-muted-foreground">
              Regulatory updates, benchmarks, and industry data
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/benchmark')}
          className="whitespace-nowrap"
        >
          <ListFilter className="h-4 w-4 mr-2" />
          View Industry Benchmarks
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <ESGRegulationsList />
          <ESGBenchmarkCard />
        </TabsContent>
        
        <TabsContent value="data-sources" className="space-y-6">
          <DataSourceHealth />
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <CardTitle className="text-xl">Data Collection Schedule</CardTitle>
              </div>
              <CardDescription>
                Automated data collection schedule and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-md">
                  <h3 className="font-medium">Regulatory Updates</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Collects ESG regulations, frameworks, and guidelines from authoritative sources.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span>
                      <span className="font-medium">Frequency:</span> Daily
                    </span>
                    <span>
                      <span className="font-medium">Next run:</span> Tomorrow, 3:00 AM UTC
                    </span>
                    <span>
                      <span className="font-medium">Sources:</span> 15
                    </span>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <h3 className="font-medium">Carbon Emissions Data</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Collects industry and country-level carbon emissions data and forecasts.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span>
                      <span className="font-medium">Frequency:</span> Weekly
                    </span>
                    <span>
                      <span className="font-medium">Next run:</span> Sunday, 5:00 AM UTC
                    </span>
                    <span>
                      <span className="font-medium">Sources:</span> 8
                    </span>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <h3 className="font-medium">ESG Ratings & Benchmarks</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Collects ESG ratings, peer benchmarks, and industry standards.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span>
                      <span className="font-medium">Frequency:</span> Monthly
                    </span>
                    <span>
                      <span className="font-medium">Next run:</span> Nov 1, 1:00 AM UTC
                    </span>
                    <span>
                      <span className="font-medium">Sources:</span> 6
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </InsightsLayout>
  );
};

export default ExternalData;
