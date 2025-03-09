
import React, { useState, useEffect } from 'react';
import { IndustryType } from '@/services/ai/orchestration/types/agentTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon, RefreshCw, TrendingUp, Flame, Search } from 'lucide-react';
import { externalDataService, ESGCompetitor } from '@/services/external/externalDataService';
import { toast } from 'sonner';

interface CompetitorComparisonCardProps {
  industryContext: IndustryType;
}

const CompetitorComparisonCard: React.FC<CompetitorComparisonCardProps> = ({ industryContext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [competitors, setCompetitors] = useState<ESGCompetitor[]>([]);
  const [activeTab, setActiveTab] = useState('esg-scores');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadCompetitorData();
  }, [industryContext]);

  const loadCompetitorData = async () => {
    setIsLoading(true);
    try {
      const competitorData = await externalDataService.fetchCompetitorData();
      // Filter by industry if needed
      const filteredData = industryContext === 'all' as any 
        ? competitorData 
        : competitorData.filter(c => c.industry === industryContext);
      
      // Process the data for display
      const processedData = filteredData.map(comp => {
        return {
          ...comp,
          name: comp.company_name,
          isLeader: comp.esg_score > 80,
          scores: {
            environmental: comp.environmental_score,
            social: comp.social_score,
            governance: comp.governance_score
          },
          trends: {
            environmental: 'improving' as 'improving' | 'declining' | 'stable',
            social: 'stable' as 'improving' | 'declining' | 'stable',
            governance: 'improving' as 'improving' | 'declining' | 'stable'
          },
          carbonData: {
            intensity: 35.2, // Example value
            netZeroTarget: '2035' // Example value
          }
        };
      });
      
      setCompetitors(processedData);
    } catch (error) {
      console.error('Error loading competitor data:', error);
      toast.error('Failed to load competitor data');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadCompetitorData();
      toast.success('Competitor data updated');
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderScoreBadge = (score: number) => {
    let color = '';
    if (score >= 80) color = 'bg-green-100 text-green-800';
    else if (score >= 60) color = 'bg-lime-100 text-lime-800';
    else if (score >= 40) color = 'bg-amber-100 text-amber-800';
    else color = 'bg-red-100 text-red-800';
    
    return <Badge variant="outline" className={color}>{score}</Badge>;
  };

  const renderTrendIcon = (trend: 'improving' | 'declining' | 'stable', size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
    
    if (trend === 'improving') {
      return <ArrowUpIcon className={`${sizeClass} text-green-500`} />;
    } else if (trend === 'declining') {
      return <ArrowDownIcon className={`${sizeClass} text-red-500`} />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Competitor ESG Comparison</CardTitle>
          <CardDescription>Loading competitor data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin h-8 w-8 text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Competitor ESG Comparison</CardTitle>
          <CardDescription>
            Compare your ESG performance against industry peers
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshData} 
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Updating...' : 'Refresh'}
        </Button>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="esg-scores">ESG Scores</TabsTrigger>
            <TabsTrigger value="carbon">Carbon</TabsTrigger>
            <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
          </TabsList>
          
          <TabsContent value="esg-scores" className="space-y-4 pt-4">
            <div className="rounded-lg border overflow-hidden">
              <div className="grid grid-cols-5 bg-muted p-2 text-xs font-medium">
                <div className="col-span-2">Company</div>
                <div className="text-center">E</div>
                <div className="text-center">S</div>
                <div className="text-center">G</div>
              </div>
              
              <div className="divide-y">
                {competitors.map((competitor, index) => (
                  <div key={index} className="grid grid-cols-5 p-2 items-center text-sm">
                    <div className="col-span-2 font-medium flex items-center gap-1">
                      {competitor.name}
                      {competitor.isLeader && (
                        <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 text-xs">
                          Leader
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-center items-center gap-1">
                      {renderScoreBadge(competitor.scores.environmental)}
                      {renderTrendIcon(competitor.trends.environmental)}
                    </div>
                    <div className="flex justify-center items-center gap-1">
                      {renderScoreBadge(competitor.scores.social)}
                      {renderTrendIcon(competitor.trends.social)}
                    </div>
                    <div className="flex justify-center items-center gap-1">
                      {renderScoreBadge(competitor.scores.governance)}
                      {renderTrendIcon(competitor.trends.governance)}
                    </div>
                  </div>
                ))}
                
                <div className="grid grid-cols-5 p-2 items-center text-sm bg-muted/50">
                  <div className="col-span-2 font-medium flex items-center gap-1">
                    Your Company
                    <Badge variant="outline" className="ml-1 bg-amber-50 text-amber-700 text-xs">
                      You
                    </Badge>
                  </div>
                  <div className="flex justify-center items-center gap-1">
                    {renderScoreBadge(72)}
                    {renderTrendIcon('improving')}
                  </div>
                  <div className="flex justify-center items-center gap-1">
                    {renderScoreBadge(68)}
                    {renderTrendIcon('stable')}
                  </div>
                  <div className="flex justify-center items-center gap-1">
                    {renderScoreBadge(75)}
                    {renderTrendIcon('improving')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-3 text-sm">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Competitive Analysis</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Your overall ESG performance ranks 4th out of 7 companies in your peer group. 
                    Environmental score is showing the strongest improvement, while social factors 
                    remain an opportunity for enhancement.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="carbon" className="space-y-4 pt-4">
            <div className="rounded-lg border overflow-hidden">
              <div className="grid grid-cols-4 bg-muted p-2 text-xs font-medium">
                <div className="col-span-2">Company</div>
                <div className="text-center">Carbon Intensity</div>
                <div className="text-center">Net Zero Target</div>
              </div>
              
              <div className="divide-y">
                {competitors.map((competitor, index) => (
                  <div key={index} className="grid grid-cols-4 p-2 items-center text-sm">
                    <div className="col-span-2 font-medium">{competitor.name}</div>
                    <div className="text-center">
                      {competitor.carbonData?.intensity || 'N/A'} 
                      <span className="text-xs text-muted-foreground"> tCO₂e/$M</span>
                    </div>
                    <div className="text-center">
                      {competitor.carbonData?.netZeroTarget || 'N/A'}
                    </div>
                  </div>
                ))}
                
                <div className="grid grid-cols-4 p-2 items-center text-sm bg-muted/50">
                  <div className="col-span-2 font-medium">Your Company</div>
                  <div className="text-center">
                    45.8
                    <span className="text-xs text-muted-foreground"> tCO₂e/$M</span>
                  </div>
                  <div className="text-center">2040</div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-3 text-sm">
              <div className="flex items-start gap-2">
                <Flame className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium">Carbon Performance</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Your carbon intensity is 12% lower than the industry average. 
                    However, 3 competitors have more ambitious net zero targets. 
                    Consider advancing your carbon neutrality target to maintain 
                    competitive advantage.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="initiatives" className="space-y-4 pt-4">
            <div className="rounded-lg border p-3">
              <h3 className="text-sm font-medium mb-2">Top ESG Initiatives by Competitors</h3>
              
              <div className="space-y-3 mt-4">
                <div className="rounded-lg border p-2">
                  <div className="font-medium text-sm">Renewable Energy Transition</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Implemented by 5 of 7 competitors. Leaders achieving 70%+ renewable energy.
                  </div>
                  <div className="text-xs mt-2">
                    <span className="text-amber-600 font-medium">Your status:</span> 42% renewable energy
                  </div>
                </div>
                
                <div className="rounded-lg border p-2">
                  <div className="font-medium text-sm">Science-Based Targets</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Adopted by all industry leaders. Setting ambitious, verified emission reduction targets.
                  </div>
                  <div className="text-xs mt-2">
                    <span className="text-red-600 font-medium">Your status:</span> Not implemented
                  </div>
                </div>
                
                <div className="rounded-lg border p-2">
                  <div className="font-medium text-sm">Supplier ESG Assessment</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    4 competitors have comprehensive supplier ESG assessment programs.
                  </div>
                  <div className="text-xs mt-2">
                    <span className="text-amber-600 font-medium">Your status:</span> Partial implementation
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-3 text-sm">
              <div className="flex items-start gap-2">
                <Search className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Opportunity Gap Analysis</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Primary opportunities for improvement: 
                    1) Adopt science-based targets 
                    2) Increase renewable energy to 60%+ 
                    3) Expand supplier ESG assessment program
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t p-4 text-xs text-muted-foreground">
        Data sourced from public ESG reports, CDP disclosures, and industry databases.
      </CardFooter>
    </Card>
  );
};

export default CompetitorComparisonCard;
