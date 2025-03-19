
import { CompanyESGData } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, TrendingUp, TrendingDown, Minus, Calendar, Globe, Users, FileText } from "lucide-react";

interface CompanyESGScoreCardProps {
  companyData: CompanyESGData;
}

const CompanyESGScoreCard = ({ companyData }: CompanyESGScoreCardProps) => {
  const { name, ticker, industry, esgScores, lastUpdated } = companyData;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getBadgeVariant = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'default';
    if (score >= 40) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Building className="h-5 w-5 mr-2" />
              {name}
            </h2>
            <div className="flex items-center mt-1 space-x-2">
              <Badge variant="outline" className="bg-primary-foreground/20 text-primary-foreground">
                {ticker}
              </Badge>
              <span className="text-sm opacity-80">{industry}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80 flex items-center justify-end">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Last Updated: {new Date(lastUpdated).toLocaleDateString()}
            </div>
            <div className="text-sm opacity-80 mt-1 flex items-center justify-end">
              <FileText className="h-3.5 w-3.5 mr-1" />
              Source: Finnhub ESG API
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        <div className="grid grid-cols-4 divide-x">
          <ScoreItem
            label="Total ESG"
            score={esgScores.total}
            trend={esgScores.totalTrend}
            badgeVariant={getBadgeVariant(esgScores.total)}
            trendIcon={getTrendIcon(esgScores.totalTrend)}
          />
          <ScoreItem
            label="Environmental"
            score={esgScores.environmental}
            trend={esgScores.environmentalTrend}
            badgeVariant={getBadgeVariant(esgScores.environmental)}
            trendIcon={getTrendIcon(esgScores.environmentalTrend)}
            icon={<Globe className="h-3.5 w-3.5 mr-1" />}
          />
          <ScoreItem
            label="Social"
            score={esgScores.social}
            trend={esgScores.socialTrend}
            badgeVariant={getBadgeVariant(esgScores.social)}
            trendIcon={getTrendIcon(esgScores.socialTrend)}
            icon={<Users className="h-3.5 w-3.5 mr-1" />}
          />
          <ScoreItem
            label="Governance"
            score={esgScores.governance}
            trend={esgScores.governanceTrend}
            badgeVariant={getBadgeVariant(esgScores.governance)}
            trendIcon={getTrendIcon(esgScores.governanceTrend)}
            icon={<FileText className="h-3.5 w-3.5 mr-1" />}
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface ScoreItemProps {
  label: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  badgeVariant: string;
  trendIcon: React.ReactNode;
  icon?: React.ReactNode;
}

const ScoreItem = ({ label, score, badgeVariant, trendIcon, icon }: ScoreItemProps) => {
  return (
    <div className="p-4 text-center">
      <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center">
        {icon || null}
        {label}
      </div>
      <div className="flex items-center justify-center space-x-2">
        <Badge variant={badgeVariant as any} className="text-md px-2.5 py-1">
          {score}
        </Badge>
        <span className="flex items-center">{trendIcon}</span>
      </div>
    </div>
  );
};

export default CompanyESGScoreCard;
