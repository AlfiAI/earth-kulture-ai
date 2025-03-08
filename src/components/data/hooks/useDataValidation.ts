
import { useState } from 'react';
import { ValidationResults } from '../ValidationTypes';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validationService } from "@/services/validation/validationService";

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

  const handleValidate = async () => {
    setIsValidating(true);
    setProgress(0);
    setValidationComplete(false);
    
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      // Start progress indicator
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 95) {
            clearInterval(progressInterval);
          }
          return newProgress < 95 ? newProgress : 95;
        });
      }, 100); // Slightly faster progress updates
      
      // Performance monitoring
      const startTime = performance.now();
      
      // Call the data validation edge function
      const { data, error } = await supabase.functions.invoke("data-validation", {
        body: {
          userId: userData.user.id,
          validateWith: "deepseek-r1" // Use DeepSeek-R1 for advanced validation
        }
      });
      
      // Performance tracking
      const endTime = performance.now();
      console.log(`Validation completed in ${Math.round(endTime - startTime)}ms`);
      
      clearInterval(progressInterval);
      
      if (error) {
        throw error;
      }
      
      setProgress(100);
      setTimeout(() => {
        setIsValidating(false);
        setValidationResults(data.results);
        setValidationComplete(true);
        toast.success('ESG data validation complete');
      }, 500);
    } catch (error) {
      console.error('Error during validation:', error);
      toast.error('Error during validation. Please try again.');
      setIsValidating(false);
      setValidationComplete(true);
    }
  };

  const fixIssues = async (issues: ValidationResults['issues']) => {
    // Map issue types to fix strategies with improved AI intelligence
    const fixStrategies: Record<string, (issue: ValidationResults['issues'][0]) => Promise<boolean>> = {
      data_completeness: async (issue) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) return false;
          
          // Use validationService for AI-enhanced fixes
          const result = await validationService.fixDataCompleteness(
            userData.user.id, 
            issue.message
          );
          
          return result.success;
        } catch (error) {
          console.error(`Error fixing data completeness:`, error);
          return false;
        }
      },
      data_range: async (issue) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) return false;
          
          // Use validationService for AI-enhanced fixes
          const result = await validationService.fixDataRange(
            userData.user.id, 
            issue.message
          );
          
          return result.success;
        } catch (error) {
          console.error(`Error fixing data range:`, error);
          return false;
        }
      },
      data_timeframe: async (issue) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) return false;
          
          // Use validationService for AI-enhanced fixes
          const result = await validationService.fixDataTimeframe(
            userData.user.id, 
            issue.message
          );
          
          return result.success;
        } catch (error) {
          console.error(`Error fixing data timeframe:`, error);
          return false;
        }
      },
      data_consistency: async (issue) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) return false;
          
          // Use validationService for AI-enhanced fixes
          const result = await validationService.fixDataConsistency(
            userData.user.id, 
            issue.message
          );
          
          return result.success;
        } catch (error) {
          console.error(`Error fixing data consistency:`, error);
          return false;
        }
      }
    };
    
    // Apply fixes based on issue types with enhanced error handling
    let fixedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    toast.info(`AI is analyzing and fixing ${issues.length} data issues...`);
    
    for (const issue of issues) {
      const strategy = fixStrategies[issue.source];
      if (strategy) {
        try {
          const success = await strategy(issue);
          if (success) fixedCount++;
          else errorCount++;
        } catch (error) {
          console.error(`Error fixing issue ${issue.message}:`, error);
          errorCount++;
        }
      } else {
        console.log(`No fix strategy for issue type: ${issue.source}`);
        skippedCount++;
      }
    }
    
    return { fixedCount, errorCount, skippedCount };
  };

  const handleFixIssues = async () => {
    toast.info('DeepSeek-R1 AI is analyzing and fixing data issues...');
    
    try {
      const startTime = performance.now();
      const { fixedCount, errorCount, skippedCount } = await fixIssues(validationResults.issues);
      const endTime = performance.now();
      
      console.log(`Issue fixing completed in ${Math.round(endTime - startTime)}ms`);
      
      // Run validation again to get updated results
      await handleValidate();
      
      if (fixedCount > 0) {
        toast.success(`Successfully fixed ${fixedCount} issues automatically.`);
      }
      
      if (errorCount > 0) {
        toast.error(`Could not fix ${errorCount} issues automatically. Manual review required.`);
      }
      
      if (skippedCount > 0) {
        toast.info(`Skipped ${skippedCount} issues that require manual attention.`);
      }
    } catch (error) {
      console.error('Error fixing issues:', error);
      toast.error('Error fixing issues. Please try again later.');
    }
  };

  const resetValidation = () => {
    setValidationComplete(false);
    setValidationResults({
      valid: 0,
      warning: 0,
      error: 0,
      total: 0,
      issues: []
    });
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
