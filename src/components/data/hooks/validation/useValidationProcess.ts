
import { ValidationResults } from '../../ValidationTypes';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useValidationProcess = (
  setIsValidating: (value: boolean) => void,
  setProgress: (value: number) => void,
  setValidationComplete: (value: boolean) => void,
  setValidationResults: (results: ValidationResults) => void
) => {
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
      
      // Start with initial progress
      let currentProgress = 0;
      setProgress(currentProgress);
      
      // Start progress indicator
      const progressInterval = setInterval(() => {
        currentProgress += 5;
        if (currentProgress >= 95) {
          clearInterval(progressInterval);
          return;
        }
        setProgress(currentProgress);
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

  return { handleValidate };
};
