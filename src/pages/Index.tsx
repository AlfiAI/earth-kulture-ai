
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Download, 
  LineChart, 
  Users,
  Leaf,
  Globe, 
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight, 
  Filter
} from 'lucide-react';
import DashboardCard from "@/components/dashboard/DashboardCard";
import Chart from "@/components/dashboard/Chart";
import InsightCard from "@/components/dashboard/InsightCard";
import WalyAssistant from "@/components/ai/WalyAssistant";
import AuthForm from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

// Sample carbon data
const carbonData = [
  { name: 'Jan', 'Scope 1': 240, 'Scope 2': 139, 'Scope 3': 980 },
  { name: 'Feb', 'Scope 1': 230, 'Scope 2': 168, 'Scope 3': 940 },
  { name: 'Mar', 'Scope 1': 310, 'Scope 2': 178, 'Scope 3': 1100 },
  { name: 'Apr', 'Scope 1': 340, 'Scope 2': 239, 'Scope 3': 1200 },
  { name: 'May', 'Scope 1': 280, 'Scope 2': 249, 'Scope 3': 1180 },
  { name: 'Jun', 'Scope 1': 220, 'Scope 2': 184, 'Scope 3': 1050 },
  { name: 'Jul', 'Scope 1': 250, 'Scope 2': 162, 'Scope 3': 950 },
  { name: 'Aug', 'Scope 1': 210, 'Scope 2': 142, 'Scope 3': 920 }
];

// Sample ESG score data
const esgScoreData = [
  { name: 'Jan', score: 68 },
  { name: 'Feb', score: 72 },
  { name: 'Mar', score: 74 },
  { name: 'Apr', score: 78 },
  { name: 'May', score: 82 },
  { name: 'Jun', score: 80 },
  { name: 'Jul', score: 85 },
  { name: 'Aug', score: 88 }
];

// Sample category data
const categoryData = [
  { name: 'Environment', value: 85 },
  { name: 'Social', value: 72 },
  { name: 'Governance', value: 78 }
];

// Sample insights
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
  }
];

// Sample compliance items
const complianceItems = [
  {
    name: 'GHG Protocol',
    status: 'Compliant',
    score: 92,
    lastUpdated: '2 days ago',
    deadline: null
  },
  {
    name: 'TCFD Reporting',
    status: 'In Progress',
    score: 68,
    lastUpdated: '5 days ago',
    deadline: 'Sep 30, 2023'
  },
  {
    name: 'EU Taxonomy',
    status: 'Attention Needed',
    score: 45,
    lastUpdated: '12 days ago',
    deadline: 'Oct 15, 2023'
  },
  {
    name: 'CDP Climate Change',
    status: 'Compliant',
    score: 88,
    lastUpdated: '1 month ago',
    deadline: null
  }
];

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to false to show login form
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <AuthForm onSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
            <DashboardCard
              title="ESG Score"
              description="Overall performance"
              className="col-span-1"
            >
              <div className="flex flex-col items-center justify-center pt-2 pb-4">
                <div className="relative h-32 w-32 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="h-32 w-32 -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-muted"
                        strokeWidth="2"
                      ></circle>
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-primary"
                        strokeWidth="2"
                        strokeDasharray="100"
                        strokeDashoffset="12"
                        strokeLinecap="round"
                      ></circle>
                    </svg>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">88</span>
                    <span className="text-xs text-muted-foreground">out of 100</span>
                  </div>
                </div>
                
                <div className="w-full flex justify-between text-sm mt-4">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">E</span>
                    <span className="text-xs text-muted-foreground">85/100</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">S</span>
                    <span className="text-xs text-muted-foreground">72/100</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">G</span>
                    <span className="text-xs text-muted-foreground">78/100</span>
                  </div>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="Carbon Footprint"
              description="Monthly comparison"
              className="col-span-1"
            >
              <div className="flex flex-col space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Scope 1</span>
                      <span className="text-xs text-muted-foreground">210 tCO2e</span>
                    </div>
                    <Progress value={21} className="h-2" />
                  </div>
                  <div className="text-xs flex items-center gap-1 text-green-600">
                    <ArrowDownRight className="h-3 w-3" />
                    <span>5%</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Scope 2</span>
                      <span className="text-xs text-muted-foreground">142 tCO2e</span>
                    </div>
                    <Progress value={14} className="h-2" />
                  </div>
                  <div className="text-xs flex items-center gap-1 text-green-600">
                    <ArrowDownRight className="h-3 w-3" />
                    <span>12%</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Scope 3</span>
                      <span className="text-xs text-muted-foreground">920 tCO2e</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="text-xs flex items-center gap-1 text-green-600">
                    <ArrowDownRight className="h-3 w-3" />
                    <span>3%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 text-sm">
                  <div>
                    <span className="font-medium">1,272</span>
                    <span className="text-xs text-muted-foreground ml-1">tCO2e Total</span>
                  </div>
                  <div className="flex items-center text-green-600 text-xs font-medium">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    <span>5.2% vs last month</span>
                  </div>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="Compliance Status"
              description="Framework adherence"
              className="col-span-1"
            >
              <div className="space-y-3 pt-2">
                {complianceItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.lastUpdated}
                      </span>
                    </div>
                    <Badge
                      className={cn(
                        "text-xs",
                        item.status === 'Compliant' && "bg-green-100 text-green-800 hover:bg-green-200",
                        item.status === 'In Progress' && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                        item.status === 'Attention Needed' && "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      )}
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
                <span>12 frameworks tracked</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary"
                  onClick={() => navigate('/compliance')}
                >
                  View all
                </Button>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="Activity"
              description="Recent updates"
              className="col-span-1"
            >
              <div className="space-y-3 pt-2">
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="h-4 w-4 text-sky-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Data updated</p>
                    <p className="text-xs text-muted-foreground">Energy consumption data refreshed</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Report generated</p>
                    <p className="text-xs text-muted-foreground">Q2 Sustainability report created</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Team member added</p>
                    <p className="text-xs text-muted-foreground">Sarah Johnson joined as Analyst</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
            <DashboardCard
              title="Carbon Emissions Trend"
              description="Last 8 months by scope"
              contentClassName="p-0"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    Total emissions: <span className="font-medium text-foreground">9,540 tCO2e</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      <span className="text-xs">Filter</span>
                    </Button>
                    
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span className="text-xs">Export</span>
                    </Button>
                  </div>
                </div>
                
                <Tabs defaultValue="line">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="line">Line</TabsTrigger>
                    <TabsTrigger value="bar">Bar</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="line" className="pt-2">
                    <Chart
                      data={carbonData}
                      type="line"
                      dataKey="Scope 1"
                      secondaryDataKey="Scope 2"
                      height={300}
                    />
                  </TabsContent>
                  
                  <TabsContent value="bar" className="pt-2">
                    <Chart
                      data={carbonData}
                      type="bar"
                      dataKey="Scope 1"
                      secondaryDataKey="Scope 2"
                      height={300}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="ESG Score Progression"
              description="Historical performance"
              contentClassName="p-0"
            >
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex flex-col text-center p-3 rounded-md bg-muted/50">
                      <span className="text-lg font-semibold">{category.value}</span>
                      <span className="text-sm text-muted-foreground">{category.name}</span>
                    </div>
                  ))}
                </div>
                
                <Chart
                  data={esgScoreData}
                  type="line"
                  dataKey="score"
                  height={236}
                  colors={['#5a9c69']}
                />
              </div>
            </DashboardCard>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">AI-Generated Insights</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/insights')}>View all insights</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleInsights.slice(0, 4).map((insight, index) => (
                <InsightCard
                  key={index}
                  type={insight.type as any}
                  title={insight.title}
                  description={insight.description}
                  indicator={insight.indicator as any}
                  percentageChange={insight.percentageChange}
                  date={insight.date}
                  onClick={() => navigate('/insights')}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
      
      <WalyAssistant initialOpen={false} />
    </div>
  );
};

export default Index;
