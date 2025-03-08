
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Activity,
  Users,
  Building2,
  PieChart
} from "lucide-react";
import { CompetitorSustainabilityData, benchmarkingService } from "@/services/benchmarking";
import { Skeleton } from "@/components/ui/skeleton";

const CompetitorComparisonCard = () => {
  const [competitors, setCompetitors] = useState<CompetitorSustainabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overall");
  
  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        setLoading(true);
        const data = await benchmarkingService.getCompetitorData("Technology");
        setCompetitors(data);
      } catch (error) {
        console.error("Error loading competitor data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompetitors();
  }, []);

  // Find your company in the competitors list
  const yourCompany = competitors.find(c => c.companyId === "your-company");
  
  // Sort competitors by the active metric
  const sortedCompetitors = [...competitors].sort((a, b) => {
    if (activeTab === "overall") return b.esgScore - a.esgScore;
    if (activeTab === "environmental") return b.carbonScore - a.carbonScore;
    if (activeTab === "social") return b.socialScore - a.socialScore;
    if (activeTab === "governance") return b.governanceScore - a.governanceScore;
    return 0;
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Building2 className="mr-2 h-5 w-5 text-primary" />
          Competitor Sustainability Analysis
        </CardTitle>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overall">
              <PieChart className="h-4 w-4 mr-2" />
              Overall ESG
            </TabsTrigger>
            <TabsTrigger value="environmental">
              <BarChart className="h-4 w-4 mr-2" />
              Environmental
            </TabsTrigger>
            <TabsTrigger value="social">
              <Users className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="governance">
              <Activity className="h-4 w-4 mr-2" />
              Governance
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {["overall", "environmental", "social", "governance"].map(tab => (
                <TabsContent key={tab} value={tab} className="mt-0 pt-0">
                  <div className="space-y-4">
                    {sortedCompetitors.map(company => {
                      // Determine which score to display based on active tab
                      let score = company.esgScore;
                      if (tab === "environmental") score = company.carbonScore;
                      if (tab === "social") score = company.socialScore;
                      if (tab === "governance") score = company.governanceScore;
                      
                      // Find max score for progress bar scaling
                      const maxScore = Math.max(
                        ...sortedCompetitors.map(c => {
                          if (tab === "overall") return c.esgScore;
                          if (tab === "environmental") return c.carbonScore;
                          if (tab === "social") return c.socialScore;
                          if (tab === "governance") return c.governanceScore;
                          return 0;
                        })
                      );
                      
                      // Highlight if this is your company
                      const isYourCompany = company.companyId === "your-company";
                      
                      return (
                        <div 
                          key={company.companyId}
                          className={`p-3 rounded-md ${isYourCompany ? 'bg-primary/10 border border-primary/30' : 'bg-muted/40'}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              {isYourCompany && (
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full mr-2">
                                  You
                                </span>
                              )}
                              <span className="font-medium">{company.companyName}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-lg font-bold">{score}</span>
                              <span className="text-xs ml-1">/100</span>
                              
                              {company.changeFromPrevYear !== 0 && (
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                                  company.changeFromPrevYear > 0 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {company.changeFromPrevYear > 0 ? '+' : ''}
                                  {company.changeFromPrevYear}%
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <Progress value={score} max={100} className="h-2" />
                          
                          {isYourCompany && (
                            <div className="mt-2 pt-2 border-t border-border/50">
                              <div className="text-xs text-muted-foreground mb-1">Highlights:</div>
                              <div className="flex flex-wrap gap-1">
                                {company.highlights.map((highlight, idx) => (
                                  <span key={idx} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Key insights for your company */}
                  {yourCompany && (
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">AI-Generated Insights</h4>
                      <div className="space-y-2 text-sm">
                        <div className="p-3 bg-muted/30 rounded-md">
                          {activeTab === "overall" && (
                            <p>Your overall ESG score is {Math.round(100 - (yourCompany.esgScore / sortedCompetitors[0].esgScore) * 100)}% below the top performer in your industry. Focus on improving your environmental initiatives for the biggest potential gain.</p>
                          )}
                          
                          {activeTab === "environmental" && (
                            <p>Your carbon score shows the largest gap compared to industry leaders. Consider implementing renewable energy sources and enhancing your emissions tracking for Scope 3.</p>
                          )}
                          
                          {activeTab === "social" && (
                            <p>Your social performance is competitive but could be enhanced through more robust diversity and inclusion policies and community engagement programs.</p>
                          )}
                          
                          {activeTab === "governance" && (
                            <p>Your governance structures are well-designed, but transparency in ESG reporting could be improved to match industry best practices.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          )}
          
          <div className="mt-4 pt-2 border-t text-xs text-muted-foreground flex justify-between">
            <span>Source: AI-analyzed sustainability reports</span>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default CompetitorComparisonCard;
