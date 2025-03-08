
import { useValidationState } from './validation/useValidationState';
import { useValidationProcess } from './validation/useValidationProcess';
import { useIssueFixer } from './validation/useIssueFixer';

export const useDataValidation = () => {
  const {
    isValidating,
    setIsValidating,
    validationComplete,
    setValidationComplete,
    progress,
    setProgress,
    validationResults,
    setValidationResults,
    resetValidation
  } = useValidationState();

  const { handleValidate } = useValidationProcess(
    setIsValidating,
    setProgress,
    setValidationComplete,
    setValidationResults
  );

  const { handleFixIssues } = useIssueFixer(handleValidate);

  return {
    isValidating,
    validationComplete,
    progress,
    validationResults,
    handleValidate,
    handleFixIssues: () => handleFixIssues(validationResults.issues),
    resetValidation
  };
};
