
import { useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ValidationForm from './ValidationForm';
import ValidationResults, { ValidationIssuesList } from './ValidationResults';
import { ValidationResults as ValidationResultsType } from './ValidationTypes';
import { deepseekService } from '@/services/ai/deepseekService';

// System prompt for data validation
const DATA_VALIDATION_PROMPT = `You are Waly's data validation assistant. Your role is to analyze ESG and carbon emissions data for quality issues,
inconsistencies, and compliance problems. When analyzing data, consider:

1. Data completeness (missing values, incomplete time series)
2. Data consistency (unusual patterns, outliers, inconsistent units)
3. Compliance requirements (data needed for specific reporting frameworks)
4. Data quality (accuracy, reliability of data sources)

Provide specific identification of issues and actionable recommendations for fixing them.`;

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
            performAIValidation();
          }, 500);
        }
        return newProgress;
      });
    }, 120);
  };
  
  const performAIValidation = async () => {
    try {
      // Get AI-powered validation insights
      const validationPrompt = `Perform a comprehensive validation analysis on the organization's ESG and carbon data, 
      identifying quality issues, inconsistencies, and potential compliance problems.`;
      
      // Call DeepSeek for validation
      const aiValidationResponse = await deepseekService.processQuery(
        validationPrompt, 
        [],
        DATA_VALIDATION_PROMPT
      );
      
      console.log("AI validation response:", aiValidationResponse);
      
      // Parse the response to extract issues
      // For demo, we'll use mock data but in production this would parse the AI response
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
      
      setValidationComplete(true);
      toast.success('ESG data validation complete');
    } catch (error) {
      console.error('Error performing AI validation:', error);
      toast.error('Error during validation. Please try again.');
      
      // Fallback to mock data
      setValidationResults({
        valid: 90,
        warning: 8,
        error: 2,
        total: 100,
        issues: [
          {
            type: 'error',
            message: 'Data validation failed - using fallback results',
            source: 'System',
            recommendation: 'Try again later when API connection is restored'
          }
        ]
      });
      
      setValidationComplete(true);
    }
  };
  
  const handleFixIssues = async () => {
    toast.info('AI is analyzing and fixing data issues...');
    
    try {
      // Get AI-powered fix recommendations
      const fixPrompt = `Based on the identified data issues, suggest automated fixes and data transformation steps 
      to resolve the critical errors without manual intervention.`;
      
      // Call DeepSeek for fix recommendations
      await deepseekService.processQuery(
        fixPrompt,
        [],
        DATA_VALIDATION_PROMPT
      );
      
      // For demo, simulate fixing
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
    } catch (error) {
      console.error('Error fixing issues:', error);
      toast.error('Error fixing issues. Please try again later.');
    }
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
