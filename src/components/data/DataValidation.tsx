
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ValidationForm from './ValidationForm';
import ValidationResults from './ValidationResults';
import { useDataValidation } from './hooks/useDataValidation';

const DataValidation = () => {
  const {
    isValidating,
    validationComplete,
    progress,
    validationResults,
    handleValidate,
    handleFixIssues,
    resetValidation
  } = useDataValidation();

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
            <Button variant="outline" onClick={resetValidation}>
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
