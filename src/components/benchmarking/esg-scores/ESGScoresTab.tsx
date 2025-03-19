
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search, Building, BookOpen, BarChart } from "lucide-react";
import { useESGScores } from "./hooks/useESGScores";
import CompanyESGScoreCard from "./CompanyESGScoreCard";
import ESGScoreComparison from "./ESGScoreComparison";
import ESGScoreChart from "./ESGScoreChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ESGScoresTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    searchCompany, 
    companyData, 
    comparisonData, 
    isLoading, 
    error 
  } = useESGScores();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchCompany(searchQuery);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ESG Scores Lookup</CardTitle>
          <CardDescription>
            Access comprehensive ESG scores from Finnhub for public companies and compare performance across industries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search by company name or ticker symbol"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !searchQuery.trim()}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Searching..." : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!companyData && !isLoading && (
            <div className="text-center py-8 border rounded-md bg-muted/20">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium">Enter a company name or ticker</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                Search for a publicly traded company to view its ESG scores and sustainability performance metrics.
              </p>
            </div>
          )}

          {companyData && (
            <div className="space-y-4">
              <CompanyESGScoreCard companyData={companyData} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BarChart className="h-4 w-4 mr-2" />
                      ESG Score Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ESGScoreChart companyData={companyData} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Score Interpretation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>
                      <strong>Environmental Score:</strong> {getScoreDescription(companyData.esgScores.environmental, 'environmental')}
                    </p>
                    <p>
                      <strong>Social Score:</strong> {getScoreDescription(companyData.esgScores.social, 'social')}
                    </p>
                    <p>
                      <strong>Governance Score:</strong> {getScoreDescription(companyData.esgScores.governance, 'governance')}
                    </p>
                    <p>
                      <strong>Total ESG Score:</strong> {getScoreDescription(companyData.esgScores.total, 'total')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {companyData && comparisonData && (
        <ESGScoreComparison 
          companyData={companyData} 
          comparisonData={comparisonData} 
        />
      )}
    </div>
  );
};

// Helper function to generate descriptions based on score values
function getScoreDescription(score: number, category: string): string {
  if (score >= 80) {
    return `Excellent performance (${score}/100). Industry leader in ${category} sustainability.`;
  } else if (score >= 60) {
    return `Good performance (${score}/100). Above average in ${category} metrics.`;
  } else if (score >= 40) {
    return `Average performance (${score}/100). Meeting basic ${category} standards.`;
  } else {
    return `Below average (${score}/100). Improvement needed in ${category} metrics.`;
  }
}

export default ESGScoresTab;
