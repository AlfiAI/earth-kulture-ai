
export interface ValidationIssue {
  type: 'warning' | 'error';
  message: string;
  source: string;
  recommendation: string;
}

export interface ValidationResults {
  valid: number;
  warning: number;
  error: number;
  total: number;
  issues: ValidationIssue[];
}
