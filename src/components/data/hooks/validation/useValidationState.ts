
import { useState } from 'react';
import { ValidationResults } from '../../ValidationTypes';

export const useValidationState = () => {
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
    setIsValidating,
    validationComplete,
    setValidationComplete,
    progress,
    setProgress,
    validationResults,
    setValidationResults,
    resetValidation
  };
};
