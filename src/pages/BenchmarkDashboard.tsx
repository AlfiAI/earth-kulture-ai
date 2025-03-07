
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedWalyAssistant from "@/components/ai/EnhancedWalyAssistant";
import IndustryComparison from "@/components/benchmarking/IndustryComparison";
import PredictiveInsights from "@/components/predictive/PredictiveInsights";
import SustainabilityGoals from "@/components/goals/SustainabilityGoals";
import { Gauge, Trophy, Users, Building2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

// Sample benchmark leaders data
const benchmarkLeaders = [
  { company: 'EcoTech Innovations', score: 94, rank: 1, category: 'Technology' },
  { company: 'GreenEnergy Solutions', score: 92, rank: 2, category: 'Energy' },
  { company: 'SustainCorp Global', score: 90, rank: 3, category: 'Manufacturing' },
  { company: 'EcoLogistics', score: 89, rank: 4, category: 'Transportation' },
];

// Sample regulatory benchmark data
const regulatoryCompliance = [
  { framework: 'GHG Protocol', industry: 85, company: 92, benchmark: 80 },
  { framework: 'TCFD', industry: 72, company: 78, benchmark: 75 },
  { framework: 'GRI Standards', industry: 68, company: 75, benchmark: 70 },
  { framework: 'SASB', industry: 70, company: 82, benchmark: 65 },
];

const BenchmarkDashboard = () => {
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
              <h1 className="text-2xl font-bold tracking-tight">Benchmark Dashboard</h1>
              <p className="text-muted-foreground">
                AI-powered industry comparisons, predictive insights, and sustainability goals
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="benchmarks">
            <TabsList className="mb-4">
              <TabsTrigger value="benchmarks">Industry Benchmarks</TabsTrigger>
              <TabsTrigger value="predictions">Predictive Insights</TabsTrigger>
              <TabsTrigger value="goals">Sustainability Goals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="benchmarks">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <IndustryComparison />
                </div>
                
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      Industry Leaders
                    </h3>
                    
                    <div className="space-y-4">
                      {benchmarkLeaders.map((leader, index) => (
                        <div key={index} className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-primary">#{leader.rank}</span>
                          </div>
                          <div>
                            <p className="font-medium">{leader.company}</p>
                            <p className="text-xs text-muted-foreground">{leader.category}</p>
                          </div>
                          <div className="ml-auto">
                            <p className="text-lg font-semibold">{leader.score}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        See full rankings
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center mb-4">
                      <Gauge className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-medium">Your ESG Score</h3>
                    </div>
                    <div className="text-center mb-3">
                      <span className="text-3xl font-bold">82</span>
                      <span className="text-sm text-muted-foreground ml-1">/100</span>
                    </div>
                    <div className="text-sm text-green-600 flex justify-center items-center">
                      <span>+5 points since last quarter</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center mb-4">
                      <Users className="h-5 w-5 text-indigo-500 mr-2" />
                      <h3 className="font-medium">Peer Average</h3>
                    </div>
                    <div className="text-center mb-3">
                      <span className="text-3xl font-bold">74</span>
                      <span className="text-sm text-muted-foreground ml-1">/100</span>
                    </div>
                    <div className="text-sm text-green-600 flex justify-center items-center">
                      <span>You're 8 points above average</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center mb-4">
                      <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                      <h3 className="font-medium">Industry Leader</h3>
                    </div>
                    <div className="text-center mb-3">
                      <span className="text-3xl font-bold">94</span>
                      <span className="text-sm text-muted-foreground ml-1">/100</span>
                    </div>
                    <div className="text-sm text-amber-600 flex justify-center items-center">
                      <span>12 points to reach leader</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center mb-4">
                      <Building2 className="h-5 w-5 text-purple-500 mr-2" />
                      <h3 className="font-medium">Your Percentile</h3>
                    </div>
                    <div className="text-center mb-3">
                      <span className="text-3xl font-bold">82</span>
                      <span className="text-sm text-muted-foreground ml-1">%</span>
                    </div>
                    <div className="text-sm text-green-600 flex justify-center items-center">
                      <span>Top 20% of your industry</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mb-6">
                <CardContent className="p-5">
                  <h3 className="text-lg font-medium mb-4">Regulatory Compliance Benchmarking</h3>
                  
                  <div className="space-y-5">
                    {regulatoryCompliance.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{item.framework}</span>
                          <span className="text-sm">
                            <span className="font-medium">{item.company}%</span>
                            <span className="text-muted-foreground"> / Requirement {item.benchmark}%</span>
                          </span>
                        </div>
                        <div className="h-7 bg-muted rounded-lg overflow-hidden flex">
                          <div
                            className="bg-green-500 flex items-center justify-end px-2 text-xs text-white"
                            style={{ width: `${item.benchmark}%` }}
                          >
                            Min
                          </div>
                          <div
                            className="bg-blue-400 flex items-center justify-end px-2 text-xs text-white"
                            style={{ width: `${item.industry - item.benchmark}%` }}
                          >
                            Avg
                          </div>
                          <div
                            className="bg-blue-600 flex items-center justify-center px-2 text-xs text-white"
                            style={{ width: `${item.company - item.industry}%` }}
                          >
                            You
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Regulatory minimum</span>
                          <span>Industry average</span>
                          <span>Your score</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="predictions">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <PredictiveInsights />
                
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-medium mb-4">AI Trend Analysis</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">ESG Score Trajectory</span>
                          <span className="text-sm text-green-600">+5% projected</span>
                        </div>
                        <Progress value={65} className="h-2" indicatorClassName="bg-green-500" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Projected to reach 86/100 by Q4 2023
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Carbon Reduction Progress</span>
                          <span className="text-sm text-green-600">-12% projected</span>
                        </div>
                        <Progress value={45} className="h-2" indicatorClassName="bg-green-500" />
                        <p className="text-xs text-muted-foreground mt-1">
                          On track to meet 2025 reduction targets
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">New Regulatory Readiness</span>
                          <span className="text-sm text-amber-600">72% ready</span>
                        </div>
                        <Progress value={72} className="h-2" indicatorClassName="bg-amber-500" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Needs attention for CSRD compliance
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Supply Chain ESG Risk</span>
                          <span className="text-sm text-red-600">High exposure</span>
                        </div>
                        <Progress value={25} className="h-2" indicatorClassName="bg-red-500" />
                        <p className="text-xs text-muted-foreground mt-1">
                          3 key suppliers with low ESG scores identified
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Financial Impact Opportunity</span>
                          <span className="text-sm text-green-600">$320K projected</span>
                        </div>
                        <Progress value={85} className="h-2" indicatorClassName="bg-green-500" />
                        <p className="text-xs text-muted-foreground mt-1">
                          From energy savings and ESG-linked financing
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Button size="sm" className="w-full">
                        Generate detailed predictions
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="goals">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <SustainabilityGoals />
                
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-medium mb-4">Industry Goal Benchmarks</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Net Zero Target Year</span>
                          </div>
                          <div className="h-12 bg-muted rounded-lg overflow-hidden flex relative">
                            <div className="absolute inset-0 flex items-center px-3">
                              <div className="w-full flex items-center">
                                <div className="h-5 w-5 rounded-full bg-blue-600 border-2 border-white z-10" style={{ marginLeft: '65%' }}>
                                </div>
                                <div className="h-5 w-5 rounded-full bg-red-500 border-2 border-white z-10" style={{ marginLeft: '5%' }}>
                                </div>
                                <div className="h-5 w-5 rounded-full bg-green-500 border-2 border-white z-10" style={{ marginLeft: '10%' }}>
                                </div>
                              </div>
                            </div>
                            <div className="absolute inset-0 flex">
                              <div className="bg-muted-foreground/10 h-full" style={{ width: '20%' }}>
                                <div className="h-full flex items-center justify-center text-xs">
                                  2030
                                </div>
                              </div>
                              <div className="bg-muted-foreground/20 h-full" style={{ width: '20%' }}>
                                <div className="h-full flex items-center justify-center text-xs">
                                  2035
                                </div>
                              </div>
                              <div className="bg-muted-foreground/10 h-full" style={{ width: '20%' }}>
                                <div className="h-full flex items-center justify-center text-xs">
                                  2040
                                </div>
                              </div>
                              <div className="bg-muted-foreground/20 h-full" style={{ width: '20%' }}>
                                <div className="h-full flex items-center justify-center text-xs">
                                  2045
                                </div>
                              </div>
                              <div className="bg-muted-foreground/10 h-full" style={{ width: '20%' }}>
                                <div className="h-full flex items-center justify-center text-xs">
                                  2050
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <div className="flex items-center">
                              <div className="h-3 w-3 rounded-full bg-blue-600 mr-1"></div>
                              <span>Your target (2040)</span>
                            </div>
                            <div className="flex items-center">
                              <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                              <span>Leaders (2030)</span>
                            </div>
                            <div className="flex items-center">
                              <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                              <span>Industry avg (2045)</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">100% Renewable Energy</span>
                          </div>
                          <div className="h-7 bg-muted rounded-lg overflow-hidden flex">
                            <div
                              className="bg-green-500 flex items-center justify-end px-2 text-xs text-white"
                              style={{ width: '65%' }}
                            >
                              Leaders
                            </div>
                            <div
                              className="bg-blue-500 flex items-center justify-end px-2 text-xs text-white"
                              style={{ width: '7%' }}
                            >
                              You
                            </div>
                            <div
                              className="bg-red-500 flex items-center justify-center px-2 text-xs text-white"
                              style={{ width: '15%' }}
                            >
                              Avg
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <span className="block h-2 w-2 rounded-full bg-green-500"></span>
                              <span>Industry leaders: 65%</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="block h-2 w-2 rounded-full bg-blue-500"></span>
                              <span>Your company: 42%</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="block h-2 w-2 rounded-full bg-red-500"></span>
                              <span>Industry average: 35%</span>
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Waste Recycling Rate</span>
                          </div>
                          <div className="h-7 bg-muted rounded-lg overflow-hidden flex">
                            <div
                              className="bg-green-500 flex items-center justify-end px-2 text-xs text-white"
                              style={{ width: '92%' }}
                            >
                              Leaders
                            </div>
                            <div
                              className="bg-blue-500 flex items-center justify-end px-2 text-xs text-white"
                              style={{ width: '3%' }}
                            >
                              You
                            </div>
                            <div
                              className="bg-red-500 flex items-center justify-center px-2 text-xs text-white"
                              style={{ width: '5%' }}
                            >
                              Avg
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <span className="block h-2 w-2 rounded-full bg-green-500"></span>
                              <span>Industry leaders: 92%</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="block h-2 w-2 rounded-full bg-blue-500"></span>
                              <span>Your company: 78%</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="block h-2 w-2 rounded-full bg-red-500"></span>
                              <span>Industry average: 65%</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-medium mb-4">Goal Recommendations</h3>
                      
                      <div className="space-y-3">
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                              <Trophy className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">100% Electric Fleet</h4>
                              <p className="text-xs text-muted-foreground">High impact goal adopted by industry leaders</p>
                            </div>
                          </div>
                          <p className="text-sm mb-3">
                            Industry leaders are targeting 100% electric vehicle fleets by 2030. AI calculates your optimal transition timeline as 2032.
                          </p>
                          <Button size="sm" variant="outline" className="w-full">
                            Add this goal
                          </Button>
                        </div>
                        
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Net Positive Water Impact</h4>
                              <p className="text-xs text-muted-foreground">Emerging benchmark in your industry</p>
                            </div>
                          </div>
                          <p className="text-sm mb-3">
                            7% of your industry peers have committed to water positive operations by 2035. Early adoption would position you as a leader.
                          </p>
                          <Button size="sm" variant="outline" className="w-full">
                            Add this goal
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <EnhancedWalyAssistant initialOpen={false} />
    </div>
  );
};

export default BenchmarkDashboard;
