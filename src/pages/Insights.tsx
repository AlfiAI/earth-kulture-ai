
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InsightCard from "@/components/dashboard/InsightCard";
import EnhancedWalyAssistant from "@/components/ai/EnhancedWalyAssistant";
import { Download, Filter, Zap, RefreshCw } from 'lucide-react';

// Sample insights data
const sampleInsights = [
  {
    type: 'trend',
    title: 'Carbon intensity decreasing',
    description: 'Your carbon intensity per revenue has decreased by 12% compared to last quarter, putting you ahead of industry average.',
    indicator: 'down',
    percentageChange: -12,
    date: 'August 15, 2023'
  },
  {
    type: 'recommendation',
    title: 'Renewable energy opportunity',
    description: 'Based on your energy usage patterns, switching to renewable sources for your main facility could reduce Scope 2 emissions by up to 35% and generate ROI within 3 years.',
    date: 'August 10, 2023'
  },
  {
    type: 'alert',
    title: 'Compliance risk detected',
    description: 'New ESG reporting requirements will become mandatory in your region by Q1 next year. 3 of your current metrics need adjustments to comply.',
    date: 'August 5, 2023'
  },
  {
    type: 'info',
    title: 'Industry benchmark update',
    description: "Your sector's average ESG performance has improved by 5% this quarter. Your company maintains a position in the top quartile.",
    indicator: 'up',
    percentageChange: 8,
    date: 'July 28, 2023'
  },
  {
    type: 'trend',
    title: 'Water usage optimization',
    description: 'Your facilities have reduced water consumption by 8% this quarter through the implementation of water recycling systems.',
    indicator: 'down',
    percentageChange: -8,
    date: 'July 22, 2023'
  },
  {
    type: 'recommendation',
    title: 'Supply chain emission hotspots',
    description: 'We\'ve identified 3 key suppliers contributing to 45% of your Scope 3 emissions. Engaging with these suppliers could significantly reduce your overall footprint.',
    date: 'July 15, 2023'
  },
  {
    type: 'info',
    title: 'Renewable energy credits',
    description: 'Current REC prices are at a 2-year low. Consider purchasing additional credits to offset remaining Scope 2 emissions and meet your annual targets.',
    date: 'July 10, 2023'
  },
  {
    type: 'alert',
    title: 'Data quality issue',
    description: 'We\'ve detected inconsistencies in your transportation emissions data. This may affect the accuracy of your Scope 1 reporting by up to 7%.',
    date: 'July 5, 2023'
  }
];

const Insights = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/auth');
      }
    } else {
      navigate('/auth');
    }
  }, [navigate]);
  
  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  if (!mounted || !isAuthenticated) {
    return null;
  }
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-16",
        isMobile ? "ml-0" : ""
      )}>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="container max-w-7xl mx-auto p-4 lg:p-6 pb-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AI Insights</h1>
              <p className="text-muted-foreground">AI-powered recommendations and analysis</p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="default" size="sm" className="h-9 gap-1">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Insights</span>
              </Button>
            </div>
          </div>
          
          <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-background border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">AI-Powered ESG Insights</h2>
                <p className="text-muted-foreground mb-3">
                  Waly Pro analyzes your sustainability data using DeepSeek-R1 to provide advanced insights, trend detection, and actionable recommendations.
                </p>
                <Button variant="default" size="sm" className="gap-1">
                  <Zap className="h-4 w-4" />
                  <span>Ask Waly Pro a Question</span>
                </Button>
              </div>
            </div>
          </Card>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Insights</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleInsights.map((insight, index) => (
                  <InsightCard
                    key={index}
                    type={insight.type as any}
                    title={insight.title}
                    description={insight.description}
                    indicator={insight.indicator as any}
                    percentageChange={insight.percentageChange}
                    date={insight.date}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="trends">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleInsights
                  .filter(insight => insight.type === 'trend')
                  .map((insight, index) => (
                    <InsightCard
                      key={index}
                      type={insight.type as any}
                      title={insight.title}
                      description={insight.description}
                      indicator={insight.indicator as any}
                      percentageChange={insight.percentageChange}
                      date={insight.date}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleInsights
                  .filter(insight => insight.type === 'recommendation')
                  .map((insight, index) => (
                    <InsightCard
                      key={index}
                      type={insight.type as any}
                      title={insight.title}
                      description={insight.description}
                      date={insight.date}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="alerts">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleInsights
                  .filter(insight => insight.type === 'alert')
                  .map((insight, index) => (
                    <InsightCard
                      key={index}
                      type={insight.type as any}
                      title={insight.title}
                      description={insight.description}
                      date={insight.date}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <EnhancedWalyAssistant initialOpen={false} />
    </div>
  );
};

export default Insights;
