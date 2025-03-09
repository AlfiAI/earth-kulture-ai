
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardESGScore from "@/components/dashboard/DashboardESGScore";
import CarbonFootprint from "@/components/dashboard/CarbonFootprint";
import ComplianceStatus from "@/components/dashboard/ComplianceStatus";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import AIInsights from "@/components/dashboard/AIInsights";
import PredictiveInsights from "@/components/predictive/PredictiveInsights";
import { IndustryType } from "@/services/ai/orchestration/types/agentTypes";
import { aiContext } from "@/services/ai/context/aiContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, UserCog, BarChart3 } from "lucide-react";

export default function Index() {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const { userProfile } = useAuth();
  const [dashboardType, setDashboardType] = useState<'individual' | 'business' | 'enterprise'>('business');
  const [industryContext, setIndustryContext] = useState<any>(null);

  useEffect(() => {
    if (userProfile) {
      setDashboardType(userProfile.dashboard_preference || 'business');
      const industry = userProfile.industry as IndustryType || 'corporate';
      setIndustryContext(aiContext.getIndustryContext(industry));
    }
  }, [userProfile]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };
  
  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">ESG Dashboard</h1>
            <p className="text-muted-foreground">
              {dashboardType === 'individual' ? 'Personal Sustainability Tracking' :
               dashboardType === 'business' ? 'Business ESG Performance' :
               'Enterprise Sustainability Management'}
            </p>
          </div>
          
          {userProfile?.industry && (
            <Badge variant="outline" className="mt-2 md:mt-0 px-3 py-1 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5" />
              {userProfile.industry.charAt(0).toUpperCase() + userProfile.industry.slice(1)}
            </Badge>
          )}
        </div>

        {industryContext && (
          <Card className="mb-6 bg-muted/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Relevant Frameworks</h3>
                  <ul className="text-xs space-y-1">
                    {industryContext.relevantFrameworks.slice(0, 3).map((framework: string, index: number) => (
                      <li key={index} className="text-muted-foreground">{framework}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Key Metrics</h3>
                  <ul className="text-xs space-y-1">
                    {industryContext.keyMetrics.slice(0, 3).map((metric: string, index: number) => (
                      <li key={index} className="text-muted-foreground">{metric}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Regulatory Focus</h3>
                  <ul className="text-xs space-y-1">
                    {industryContext.regulatoryFocus.slice(0, 3).map((focus: string, index: number) => (
                      <li key={index} className="text-muted-foreground">{focus}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Benchmarking</h3>
                  <ul className="text-xs space-y-1">
                    {industryContext.benchmarkComparisons.slice(0, 3).map((benchmark: string, index: number) => (
                      <li key={index} className="text-muted-foreground">{benchmark}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {dashboardType === 'enterprise' && (
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="users">Team Members</TabsTrigger>
              <TabsTrigger value="reports">Enterprise Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              {/* Enterprise Overview Content */}
            </TabsContent>
            
            <TabsContent value="departments">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      View sustainability data for operations department.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Facilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      View sustainability data for facilities management.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Supply Chain
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      View sustainability data for supply chain.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <UserCog className="h-4 w-4" />
                      Team Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Manage team members and their access levels.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Team Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      View team engagement with sustainability initiatives.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="reports">
              {/* Enterprise Reports Content */}
            </TabsContent>
          </Tabs>
        )}
        
        {/* Main Content - customized based on dashboard type */}
        {dashboardType === 'individual' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <CarbonFootprint />
              <DashboardESGScore />
            </div>
            <AIInsights />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <DashboardESGScore />
              <CarbonFootprint />
              <ComplianceStatus />
            </div>
            
            <div className="mb-6">
              <AIInsights />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <PredictiveInsights />
              </div>
              <div>
                <ActivityFeed />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
