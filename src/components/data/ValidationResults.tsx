
import { AlertTriangle, CheckCircle, FileText, Download } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ValidationResults as ValidationResultsType } from './ValidationTypes';
import { Separator } from "@/components/ui/separator";
import { useState } from 'react';

interface ValidationResultsProps {
  results: ValidationResultsType;
}

const ValidationResults = ({ results }: ValidationResultsProps) => {
  const [filterType, setFilterType] = useState<'all' | 'error' | 'warning'>('all');
  const filteredIssues = results.issues.filter(issue => 
    filterType === 'all' || issue.type === filterType
  );

  const handleExportResults = () => {
    // Create a CSV string from validation results
    let csvContent = "issue_type,message,source,recommendation\n";
    
    results.issues.forEach(issue => {
      csvContent += `${issue.type},${issue.message.replace(',', ' ')},${issue.source},${issue.recommendation.replace(',', ' ')}\n`;
    });
    
    // Create a download link and trigger click
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'validation_results.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-medium">Validation Results</h3>
          <p className="text-sm text-muted-foreground">
            {results.total} data points analyzed
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
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
      
      <Separator />
      
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex gap-2">
          <Button 
            variant={filterType === 'all' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterType('all')}
          >
            All ({results.issues.length})
          </Button>
          <Button 
            variant={filterType === 'error' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterType('error')}
            className={filterType === 'error' ? "bg-red-600 hover:bg-red-700" : "text-red-600"}
          >
            Errors ({results.issues.filter(i => i.type === 'error').length})
          </Button>
          <Button 
            variant={filterType === 'warning' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterType('warning')}
            className={filterType === 'warning' ? "bg-amber-600 hover:bg-amber-700" : "text-amber-600"}
          >
            Warnings ({results.issues.filter(i => i.type === 'warning').length})
          </Button>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleExportResults} className="gap-1">
          <Download className="h-4 w-4" />
          <span>Export Results</span>
        </Button>
      </div>
      
      <ValidationIssuesList issues={filteredIssues} />
    </div>
  );
};

export default ValidationResults;

const ValidationIssuesList = ({ issues }: { issues: ValidationResultsType['issues'] }) => {
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
