
import { ValidationResults } from '../../ValidationTypes';
import { supabase } from "@/integrations/supabase/client";
import { validationService } from "@/services/validation/validationService";
import { toast } from "sonner";

export const useIssueFixer = (
  handleValidate: () => Promise<void>
) => {
  const fixIssues = async (issues: ValidationResults['issues']) => {
    let fixedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    toast.info(`AI is analyzing and fixing ${issues.length} data issues...`);
    
    for (const issue of issues) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          errorCount++;
          continue;
        }
        
        // Use validationService for AI-enhanced fixes
        const result = await validationService.fixIssues(issue);
        
        // Check if the fix was successful
        if (Array.isArray(result.issues) && result.issues.length < issues.length) {
          fixedCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error fixing issue ${issue.message}:`, error);
        errorCount++;
      }
    }
    
    return { fixedCount, errorCount, skippedCount };
  };

  const handleFixIssues = async (issues: ValidationResults['issues']) => {
    toast.info('DeepSeek-R1 AI is analyzing and fixing data issues...');
    
    try {
      const startTime = performance.now();
      const { fixedCount, errorCount, skippedCount } = await fixIssues(issues);
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

  return { handleFixIssues };
};
