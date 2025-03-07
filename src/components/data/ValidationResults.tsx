
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ValidationIssue {
  type: 'warning' | 'error';
  message: string;
  source: string;
  recommendation: string;
}

interface ValidationResultsProps {
  results: {
    valid: number;
    warning: number;
    error: number;
    total: number;
    issues: ValidationIssue[];
  };
}

const ValidationResults = ({ results }: ValidationResultsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-medium">Validation Results</h3>
          <p className="text-sm text-muted-foreground">
            {results.total} data points analyzed
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{results.valid}</span>
            <span className="text-xs text-muted-foreground">Valid</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium">{results.warning}</span>
            <span className="text-xs text-muted-foreground">Warnings</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium">{results.error}</span>
            <span className="text-xs text-muted-foreground">Errors</span>
          </div>
        </div>
      </div>
      
      <ValidationIssuesList issues={results.issues} />
    </div>
  );
};

export default ValidationResults;

export const ValidationIssuesList = ({ issues }: { issues: ValidationIssue[] }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Issues Detected</h4>
      {issues.length > 0 ? (
        issues.map((issue, index) => (
          <div key={index} className="border rounded-md p-3 relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              issue.type === 'error' ? 'bg-red-600' : 'bg-amber-600'
            }`} />
            <div className="pl-2 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {issue.type === 'error' ? (
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                  )}
                  <p className="text-sm font-medium">{issue.message}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {issue.source}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Recommendation: {issue.recommendation}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No issues detected in your ESG data
          </p>
        </div>
      )}
    </div>
  );
};
