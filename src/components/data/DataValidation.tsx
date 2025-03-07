
import { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const DataValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Mock validation results
  const [validationResults, setValidationResults] = useState<{
    valid: number;
    warning: number;
    error: number;
    total: number;
    issues: Array<{
      type: 'warning' | 'error';
      message: string;
      source: string;
      recommendation: string;
    }>;
  }>({
    valid: 0,
    warning: 0,
    error: 0,
    total: 0,
    issues: []
  });
  
  const handleValidate = () => {
    setIsValidating(true);
    setProgress(0);
    setValidationComplete(false);
    
    // Simulate validation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsValidating(false);
            setValidationComplete(true);
            
            // Mock validation results
            setValidationResults({
              valid: 87,
              warning: 12,
              error: 3,
              total: 102,
              issues: [
                {
                  type: 'error',
                  message: 'Missing transport emissions data for Q2',
                  source: 'Carbon Emissions Data',
                  recommendation: 'Upload transport emissions data for April-June'
                },
                {
                  type: 'error',
                  message: 'Inconsistent units in energy consumption records',
                  source: 'Energy Usage Data',
                  recommendation: 'Standardize all energy consumption to kWh'
                },
                {
                  type: 'warning',
                  message: 'Unusually high water consumption in May',
                  source: 'Water Usage Data',
                  recommendation: 'Verify water consumption records for May'
                },
                {
                  type: 'warning',
                  message: 'Employee diversity metrics incomplete',
                  source: 'Social Responsibility Data',
                  recommendation: 'Complete employee diversity data sections'
                },
                {
                  type: 'warning',
                  message: 'Supply chain emissions show unexpected pattern',
                  source: 'Scope 3 Emissions',
                  recommendation: 'Review supply chain emissions calculation methodology'
                }
              ]
            });
            
            toast.success('ESG data validation complete');
          }, 500);
        }
        return newProgress;
      });
    }, 120);
  };
  
  const handleFixIssues = () => {
    toast.info('AI is analyzing and fixing data issues...');
    
    // Simulate fixing process
    setTimeout(() => {
      setValidationResults(prev => ({
        ...prev,
        valid: 96,
        warning: 6,
        error: 0,
        issues: prev.issues.filter(issue => issue.type !== 'error')
      }));
      
      toast.success('Critical issues automatically fixed. Some warnings remain for review.');
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          AI Data Validation
        </CardTitle>
        <CardDescription>
          Automatically validate and fix issues in your ESG & carbon data
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!validationComplete ? (
          <div className="space-y-6">
            <div className="border rounded-lg p-6 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Automated Data Validation</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Our AI will scan your ESG data to identify inconsistencies, 
                missing values, and potential compliance issues.
              </p>
              
              {isValidating && (
                <div className="mb-4 space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Validating data... {progress}%
                  </p>
                </div>
              )}
              
              <Button 
                onClick={handleValidate} 
                disabled={isValidating}
                className="min-w-32"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Validate ESG Data
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-medium">Validation Results</h3>
                <p className="text-sm text-muted-foreground">
                  {validationResults.total} data points analyzed
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{validationResults.valid}</span>
                  <span className="text-xs text-muted-foreground">Valid</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">{validationResults.warning}</span>
                  <span className="text-xs text-muted-foreground">Warnings</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">{validationResults.error}</span>
                  <span className="text-xs text-muted-foreground">Errors</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Issues Detected</h4>
              {validationResults.issues.length > 0 ? (
                validationResults.issues.map((issue, index) => (
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
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {validationComplete && (
          <>
            <Button variant="outline" onClick={() => setValidationComplete(false)}>
              Run New Validation
            </Button>
            
            {validationResults.error > 0 && (
              <Button onClick={handleFixIssues}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Fix Issues Automatically
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default DataValidation;
