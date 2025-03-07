
import { useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ValidationForm from './ValidationForm';
import ValidationResults, { ValidationIssuesList } from './ValidationResults';
import { ValidationResults as ValidationResultsType } from './ValidationTypes';

const DataValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Mock validation results
  const [validationResults, setValidationResults] = useState<ValidationResultsType>({
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
            <ValidationForm 
              isValidating={isValidating} 
              progress={progress} 
              onValidate={handleValidate} 
            />
          </div>
        ) : (
          <ValidationResults results={validationResults} />
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
