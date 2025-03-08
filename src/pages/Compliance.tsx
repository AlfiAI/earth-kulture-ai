
import { useState } from 'react';
import { Download, Filter, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import DashboardCard from "@/components/dashboard/DashboardCard";
import WalyAssistant from "@/components/ai/WalyAssistant";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample compliance items
const complianceItems = [
  {
    name: 'GHG Protocol',
    status: 'Compliant',
    score: 92,
    lastUpdated: '2 days ago',
    deadline: null,
    description: 'The Greenhouse Gas Protocol provides standards, guidance, tools, and training for business and government to measure and manage climate-warming emissions.'
  },
  {
    name: 'TCFD Reporting',
    status: 'In Progress',
    score: 68,
    lastUpdated: '5 days ago',
    deadline: 'Sep 30, 2023',
    description: 'The Task Force on Climate-related Financial Disclosures provides a framework for companies to disclose climate-related financial information.'
  },
  {
    name: 'EU Taxonomy',
    status: 'Attention Needed',
    score: 45,
    lastUpdated: '12 days ago',
    deadline: 'Oct 15, 2023',
    description: 'The EU Taxonomy is a classification system establishing a list of environmentally sustainable economic activities to help scale up sustainable investment.'
  },
  {
    name: 'CDP Climate Change',
    status: 'Compliant',
    score: 88,
    lastUpdated: '1 month ago',
    deadline: null,
    description: 'CDP is a global disclosure system for investors, companies, cities, states, and regions to manage their environmental impacts.'
  },
  {
    name: 'Science Based Targets',
    status: 'In Progress',
    score: 72,
    lastUpdated: '2 weeks ago',
    deadline: 'Nov 30, 2023',
    description: 'Science-based targets show companies how much and how quickly they need to reduce their greenhouse gas emissions to prevent the worst effects of climate change.'
  },
  {
    name: 'GRI Standards',
    status: 'Compliant',
    score: 85,
    lastUpdated: '3 weeks ago',
    deadline: null,
    description: 'The GRI Standards create a common language for organizations to report on their sustainability impacts in a consistent and credible way.'
  }
];

const Compliance = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mounted, setMounted] = useState(true);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Compliant':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'Attention Needed':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar isCollapsed={!sidebarOpen} />
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-16",
        isMobile && "ml-0"
      )}>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="container max-w-7xl mx-auto p-4 lg:p-6 pb-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Compliance Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage compliance across frameworks</p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
            <DashboardCard
              title="Overall Compliance"
              description="Across all frameworks"
              className="col-span-1"
            >
              <div className="flex flex-col items-center pt-3 pb-4">
                <div className="relative h-24 w-24 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
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
                      strokeDashoffset="25"
                      strokeLinecap="round"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">75%</span>
                  </div>
                </div>
                <div className="w-full flex justify-between mt-4 text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>3 Compliant</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>1 At Risk</span>
                  </div>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="Next Deadlines"
              description="Upcoming requirements"
              className="col-span-1"
            >
              <div className="space-y-3 pt-2">
                {complianceItems
                  .filter(item => item.deadline)
                  .sort((a, b) => new Date(a.deadline || '').getTime() - new Date(b.deadline || '').getTime())
                  .slice(0, 3)
                  .map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Due {item.deadline}</p>
                      </div>
                      <Badge
                        className={cn(
                          "text-xs",
                          item.status === 'Compliant' && "bg-green-100 text-green-800",
                          item.status === 'In Progress' && "bg-blue-100 text-blue-800",
                          item.status === 'Attention Needed' && "bg-amber-100 text-amber-800"
                        )}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="Recent Updates"
              description="Framework changes"
              className="col-span-1"
            >
              <div className="space-y-3 pt-2">
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="text-sm font-medium">EU Taxonomy Update</p>
                  <p className="text-xs text-muted-foreground">New requirements added for biodiversity reporting</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
                <div className="border-l-2 border-green-500 pl-3">
                  <p className="text-sm font-medium">GHG Protocol</p>
                  <p className="text-xs text-muted-foreground">Your report was verified and approved</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
                <div className="border-l-2 border-amber-500 pl-3">
                  <p className="text-sm font-medium">SASB Standards</p>
                  <p className="text-xs text-muted-foreground">Framework updates announced for Q1 2024</p>
                  <p className="text-xs text-muted-foreground">2 weeks ago</p>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="Improvement"
              description="Month over month"
              className="col-span-1"
            >
              <div className="pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Score</span>
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>8%</span>
                  </div>
                </div>
                <Progress value={75} className="h-2 mb-4" />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Documentation</span>
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <ArrowUpRight className="h-3 w-3" />
                      <span>12%</span>
                    </div>
                  </div>
                  <Progress value={82} className="h-1.5" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Data Quality</span>
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <ArrowUpRight className="h-3 w-3" />
                      <span>5%</span>
                    </div>
                  </div>
                  <Progress value={70} className="h-1.5" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Verification</span>
                    <div className="flex items-center gap-1 text-amber-600 text-xs">
                      <ArrowDownRight className="h-3 w-3" />
                      <span>3%</span>
                    </div>
                  </div>
                  <Progress value={65} className="h-1.5" />
                </div>
              </div>
            </DashboardCard>
          </div>
          
          <div className="mb-6">
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Frameworks</TabsTrigger>
                <TabsTrigger value="compliant">Compliant</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="attention">Attention Needed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {complianceItems.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(item.status)}
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge
                            className={cn(
                              "ml-2 text-xs",
                              item.status === 'Compliant' && "bg-green-100 text-green-800",
                              item.status === 'In Progress' && "bg-blue-100 text-blue-800",
                              item.status === 'Attention Needed' && "bg-amber-100 text-amber-800"
                            )}
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                          <span>Last updated: {item.lastUpdated}</span>
                          {item.deadline && <span>Deadline: {item.deadline}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Score:</span>
                          <span className="font-medium">{item.score}/100</span>
                        </div>
                        <Progress value={item.score} className="w-full md:w-40 h-2" />
                        <Button size="sm" variant="outline" className="mt-1 text-xs">View Details</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="compliant" className="space-y-4">
                {complianceItems.filter(item => item.status === 'Compliant').map((item, index) => (
                  // Similar card structure as above
                  <Card key={index} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge className="ml-2 text-xs bg-green-100 text-green-800">
                            Compliant
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Last updated: {item.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Score:</span>
                          <span className="font-medium">{item.score}/100</span>
                        </div>
                        <Progress value={item.score} className="w-full md:w-40 h-2" />
                        <Button size="sm" variant="outline" className="mt-1 text-xs">View Details</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="in-progress" className="space-y-4">
                {complianceItems.filter(item => item.status === 'In Progress').map((item, index) => (
                  // Similar card structure with In Progress status
                  <Card key={index} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge className="ml-2 text-xs bg-blue-100 text-blue-800">
                            In Progress
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Last updated: {item.lastUpdated}</span>
                          {item.deadline && <span>Deadline: {item.deadline}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Score:</span>
                          <span className="font-medium">{item.score}/100</span>
                        </div>
                        <Progress value={item.score} className="w-full md:w-40 h-2" />
                        <Button size="sm" variant="outline" className="mt-1 text-xs">View Details</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="attention" className="space-y-4">
                {complianceItems.filter(item => item.status === 'Attention Needed').map((item, index) => (
                  // Similar card structure with Attention Needed status
                  <Card key={index} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge className="ml-2 text-xs bg-amber-100 text-amber-800">
                            Attention Needed
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Last updated: {item.lastUpdated}</span>
                          {item.deadline && <span>Deadline: {item.deadline}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Score:</span>
                          <span className="font-medium">{item.score}/100</span>
                        </div>
                        <Progress value={item.score} className="w-full md:w-40 h-2" />
                        <Button size="sm" variant="outline" className="mt-1 text-xs">View Details</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <WalyAssistant initialOpen={false} />
    </div>
  );
};

export default Compliance;
