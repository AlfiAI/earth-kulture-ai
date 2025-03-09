
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter } from 'lucide-react';
import InsightCard from "@/components/dashboard/InsightCard";
import { toast } from "sonner";
import { reportingService } from "@/services/reporting/reportingService";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth/AuthContext";

// Improved insights data with more compliance and risk intelligence
const enhancedInsights = [
  {
    type: 'trend',
    title: 'Carbon intensity decreasing',
    description: 'Your carbon intensity per revenue has decreased by 12% compared to last quarter, putting you ahead of industry average.',
    indicator: 'down',
    percentageChange: -12,
    date: 'August 15, 2023',
    category: 'carbon'
  },
  {
    type: 'recommendation',
    title: 'Renewable energy opportunity',
    description: 'Based on your energy usage patterns, switching to renewable sources for your main facility could reduce Scope 2 emissions by up to 35% and generate ROI within 3 years.',
    date: 'August 10, 2023',
    category: 'energy'
  },
  {
    type: 'alert',
    title: 'Compliance risk detected',
    description: 'New ESG reporting requirements will become mandatory in your region by Q1 next year. 3 of your current metrics need adjustments to comply.',
    date: 'August 5, 2023',
    category: 'compliance'
  },
  {
    type: 'info',
    title: 'Industry benchmark update',
    description: "Your sector's average ESG performance has improved by 5% this quarter. Your company maintains a position in the top quartile.",
    indicator: 'up',
    percentageChange: 8,
    date: 'July 28, 2023',
    category: 'benchmarking'
  },
  {
    type: 'trend',
    title: 'Water usage optimization',
    description: 'Your facilities have reduced water consumption by 8% this quarter through the implementation of water recycling systems.',
    indicator: 'down',
    percentageChange: -8,
    date: 'July 22, 2023',
    category: 'water'
  },
  {
    type: 'recommendation',
    title: 'Supply chain emission hotspots',
    description: 'We\'ve identified 3 key suppliers contributing to 45% of your Scope 3 emissions. Engaging with these suppliers could significantly reduce your overall footprint.',
    date: 'July 15, 2023',
    category: 'supply-chain'
  },
  {
    type: 'info',
    title: 'Renewable energy credits',
    description: 'Current REC prices are at a 2-year low. Consider purchasing additional credits to offset remaining Scope 2 emissions and meet your annual targets.',
    date: 'July 10, 2023',
    category: 'energy'
  },
  {
    type: 'alert',
    title: 'Data quality issue',
    description: 'We\'ve detected inconsistencies in your transportation emissions data. This may affect the accuracy of your Scope 1 reporting by up to 7%.',
    date: 'July 5, 2023',
    category: 'data-quality'
  },
  // New enhanced insights for real-time ESG intelligence and compliance monitoring
  {
    type: 'alert',
    title: 'EU CSRD compliance gap',
    description: 'Recent analysis indicates your current reporting does not fully address the biodiversity impact disclosures required under EU CSRD. This could affect compliance by Q1 next year.',
    date: 'November 8, 2023',
    category: 'regulatory'
  },
  {
    type: 'recommendation',
    title: 'AI-detected sustainability opportunity',
    description: 'Our AI has identified a pattern in your energy consumption data that suggests potential for 15-20% efficiency improvement through smart building technology implementation.',
    date: 'November 5, 2023',
    category: 'ai-insights'
  },
  {
    type: 'trend',
    title: 'Regulatory landscape shift',
    description: 'Five new climate-related disclosure regulations have been announced in your key markets over the past 30 days. AI analysis suggests 40% overlap with your current reporting.',
    indicator: 'up',
    percentageChange: 28,
    date: 'November 1, 2023',
    category: 'regulatory'
  },
  {
    type: 'info',
    title: 'Peer comparison alert',
    description: 'Three competitors in your industry have announced new science-based targets that are 15% more ambitious than yours. This may impact your industry sustainability ranking.',
    date: 'October 28, 2023',
    category: 'competitive'
  },
  {
    type: 'recommendation',
    title: 'ESG reporting automation',
    description: 'Based on your data collection patterns, implementing automated ESG data aggregation could reduce reporting time by 65% and improve data accuracy by 30%.',
    date: 'October 22, 2023',
    category: 'reporting'
  },
  {
    type: 'alert',
    title: 'Emerging supply chain risk',
    description: 'AI monitoring has detected increasing water scarcity reports in regions where 35% of your tier 2 suppliers operate. This may present a material risk within 12-18 months.',
    date: 'October 15, 2023',
    category: 'risk'
  }
];

const InsightsContent = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [insights, setInsights] = useState(enhancedInsights);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { userProfile } = useAuth();
  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'carbon', name: 'Carbon' },
    { id: 'energy', name: 'Energy' },
    { id: 'regulatory', name: 'Regulatory' },
    { id: 'compliance', name: 'Compliance' },
    { id: 'risk', name: 'Risk' },
    { id: 'ai-insights', name: 'AI Insights' }
  ];
  
  useEffect(() => {
    loadInsights();
  }, [userProfile]);
  
  const loadInsights = async () => {
    setIsLoading(true);
    try {
      // In a full implementation, this would call the backend AI service
      // For now, we'll simulate with a timeout and the enhanced sample data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter insights based on user industry if applicable
      let filteredInsights = [...enhancedInsights];
      if (userProfile?.industry) {
        // Simulate industry-specific filtering
        // In a real implementation, this would come from the AI service
        // filteredInsights = filteredInsights.filter(insight => ...);
      }
      
      setInsights(filteredInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
      toast.error('Failed to load insights');
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshInsights = async () => {
    setIsRefreshing(true);
    try {
      // This would call the AI service to generate fresh insights
      // For demo purposes, we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Insights refreshed with latest data');
      // In a real implementation, this would set new insights from the AI
      // For now, we'll just randomize the existing ones
      const shuffled = [...insights].sort(() => 0.5 - Math.random());
      setInsights(shuffled);
    } catch (error) {
      console.error('Error refreshing insights:', error);
      toast.error('Failed to refresh insights');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const filteredInsights = insights.filter(insight => {
    // First filter by tab type
    const typeMatch = activeTab === 'all' || insight.type === activeTab;
    
    // Then filter by category
    const categoryMatch = activeCategory === 'all' || insight.category === activeCategory;
    
    return typeMatch && categoryMatch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Insights</TabsTrigger>
            <TabsTrigger value="trend">Trends</TabsTrigger>
            <TabsTrigger value="recommendation">Recommendations</TabsTrigger>
            <TabsTrigger value="alert">Alerts</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              className="pl-9 h-9 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshInsights}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Insights'}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : filteredInsights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInsights.map((insight, index) => (
            <InsightCard
              key={index}
              type={insight.type as any}
              title={insight.title}
              description={insight.description}
              indicator={insight.indicator as any}
              percentageChange={insight.percentageChange}
              date={insight.date}
              onClick={() => {
                // In a full implementation, this would open a detailed view
                toast.info(`Viewing details for: ${insight.title}`);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">No insights found matching your filters.</p>
          <Button variant="link" onClick={() => {
            setActiveTab('all');
            setActiveCategory('all');
          }}>
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default InsightsContent;
