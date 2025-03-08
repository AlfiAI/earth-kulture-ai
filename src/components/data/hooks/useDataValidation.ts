
import { useState } from 'react';
import { ValidationResults } from '../ValidationTypes';
import { validationService } from '@/services/validation/validationService';
import { toast } from "sonner";

export const useDataValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<ValidationResults>({
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
      const results = await validationService.performValidation();
      setValidationResults(results);
      setValidationComplete(true);
      toast.success('ESG data validation complete');
    } catch (error) {
      console.error('Error during validation:', error);
      toast.error('Error during validation. Please try again.');
      setValidationComplete(true);
    }
  };

  const handleFixIssues = async () => {
    toast.info('AI is analyzing and fixing data issues...');
    
    try {
      const updatedResults = await validationService.fixIssues(validationResults);
      setValidationResults(updatedResults);
      toast.success('Critical issues automatically fixed. Some warnings remain for review.');
    } catch (error) {
      console.error('Error fixing issues:', error);
      toast.error('Error fixing issues. Please try again later.');
    }
  };

  const resetValidation = () => {
    setValidationComplete(false);
  };

  return {
    isValidating,
    validationComplete,
    progress,
    validationResults,
    handleValidate,
    handleFixIssues,
    resetValidation
  };
};
