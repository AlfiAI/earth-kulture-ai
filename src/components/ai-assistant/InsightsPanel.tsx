
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InsightProps } from "./types";

const InsightsPanel = () => {
  const insights: InsightProps[] = [
    {
      title: "Carbon Reduction Opportunity",
      description: "Based on your energy usage patterns, switching to renewable energy could reduce your carbon footprint by approximately 35%.",
      type: "environmental"
    },
    {
      title: "Diversity Score Improvement",
      description: "Your workforce diversity metrics are below industry average. Implementing targeted recruiting practices could improve your social score.",
      type: "social"
    },
    {
      title: "Compliance Risk Alert",
      description: "Recent changes to EU CSRD requirements may impact your reporting obligations. Review your disclosure framework by Q2 2025.",
      type: "governance"
    },
    {
      title: "Supply Chain Assessment",
      description: "25% of your tier 1 suppliers have not provided ESG data. This creates a data gap in your scope 3 emissions calculation.",
      type: "environmental"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Generated Insights</CardTitle>
        <CardDescription>Automated analysis of your ESG data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <Card key={index} className="border-l-4 border-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{insight.title}</CardTitle>
                <CardDescription className="text-xs uppercase">
                  {insight.type}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm">Get Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;
