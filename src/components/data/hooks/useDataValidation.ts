
import { useState } from 'react';
import { ValidationResults } from '../ValidationTypes';
import { supabase } from "@/integrations/supabase/client";
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
      
      // Simulate validation progress while the edge function runs
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 95) {
            clearInterval(progressInterval);
          }
          return newProgress < 95 ? newProgress : 95;
        });
      }, 120);
      
      // Call the data validation edge function
      const { data, error } = await supabase.functions.invoke("data-validation", {
        body: {
          userId: userData.user.id,
        }
      });
      
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
    // Map issue types to fix strategies
    const fixStrategies: Record<string, (issue: ValidationResults['issues'][0]) => Promise<boolean>> = {
      data_completeness: async (issue) => {
        // Auto-generate missing values or units
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return false;
        
        // Example: Updates ESG data entries with missing units
        if (issue.message.includes('unit')) {
          const { error } = await supabase
            .from('esg_data')
            .update({ unit: 'units' })
            .eq('user_id', userData.user.id)
            .is('unit', null);
          
          return !error;
        }
        return false;
      },
      data_range: async (issue) => {
        // Fix outliers or negative values
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return false;
        
        if (issue.message.includes('Negative value')) {
          const { error } = await supabase
            .from('esg_data')
            .update({ value: 0 })
            .eq('user_id', userData.user.id)
            .eq('category', 'environmental')
            .lt('value', 0);
          
          return !error;
        }
        return false;
      },
      data_timeframe: async (issue) => {
        // Fix future dates
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return false;
        
        if (issue.message.includes('Future date')) {
          const today = new Date().toISOString().split('T')[0];
          const { error } = await supabase
            .from('esg_data')
            .update({ date: today })
            .eq('user_id', userData.user.id)
            .gt('date', new Date().toISOString());
          
          return !error;
        }
        return false;
      }
    };
    
    // Apply fixes based on issue types
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const issue of issues) {
      const strategy = fixStrategies[issue.source];
      if (strategy) {
        try {
          const success = await strategy(issue);
          if (success) fixedCount++;
        } catch (error) {
          console.error(`Error fixing issue ${issue.message}:`, error);
          errorCount++;
        }
      }
    }
    
    return { fixedCount, errorCount };
  };

  const handleFixIssues = async () => {
    toast.info('AI is analyzing and fixing data issues...');
    
    try {
      const { fixedCount, errorCount } = await fixIssues(validationResults.issues);
      
      // Run validation again to get updated results
      await handleValidate();
      
      if (fixedCount > 0) {
        toast.success(`Successfully fixed ${fixedCount} issues automatically.`);
      } else if (errorCount > 0) {
        toast.error(`Could not fix ${errorCount} issues automatically. Manual review required.`);
      } else {
        toast.info('No issues could be fixed automatically. Manual review required.');
      }
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
