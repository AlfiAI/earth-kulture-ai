
import { ARIESModelResult } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ARIESModelResultsProps {
  results: ARIESModelResult;
}

const ARIESModelResults = ({ results }: ARIESModelResultsProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Model Results: {results.modelName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-muted-foreground">{results.summary}</p>
            
            <h3 className="text-base font-medium mt-4">Key Findings</h3>
            <ul className="space-y-2">
              {results.keyFindings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>
            
            {results.dataVisualization && (
              <div className="mt-4">
                <h3 className="text-base font-medium">Data Visualization</h3>
                <div className="w-full h-64 bg-muted/20 border rounded-md flex items-center justify-center text-center">
                  <div className="text-muted-foreground">
                    Interactive visualization would be displayed here in a real implementation.
                    <br />
                    The results include {results.dataPoints.length} data points for analysis.
                  </div>
                </div>
              </div>
            )}
            
            <h3 className="text-base font-medium mt-4">Recommendations</h3>
            <ul className="space-y-2">
              {results.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
            
            <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
              <p>Model executed at: {new Date(results.processedAt).toLocaleString()}</p>
              <p>Processing time: {results.processingTimeSeconds} seconds</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ARIESModelResults;
