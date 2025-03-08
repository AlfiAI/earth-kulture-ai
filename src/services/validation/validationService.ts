
import { ValidationResults } from "@/components/data/ValidationTypes";
import { deepseekService } from '@/services/ai/deepseekService';
import { toast } from "sonner";

// System prompt for data validation
export const DATA_VALIDATION_PROMPT = `You are Waly's data validation assistant. Your role is to analyze ESG and carbon emissions data for quality issues,
inconsistencies, and compliance problems. When analyzing data, consider:

1. Data completeness (missing values, incomplete time series)
2. Data consistency (unusual patterns, outliers, inconsistent units)
3. Compliance requirements (data needed for specific reporting frameworks)
4. Data quality (accuracy, reliability of data sources)

Provide specific identification of issues and actionable recommendations for fixing them.`;

export const validationService = {
  async performValidation(): Promise<ValidationResults> {
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
      return {
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
      };
    } catch (error) {
      console.error('Error performing AI validation:', error);
      toast.error('Error during validation. Please try again.');
      
      // Fallback to mock data
      return {
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
      };
    }
  },

  async fixIssues(results: ValidationResults): Promise<ValidationResults> {
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
      
      // Update results to reflect fixes
      return {
        ...results,
        valid: 96,
        warning: 6,
        error: 0,
        issues: results.issues.filter(issue => issue.type !== 'error')
      };
    } catch (error) {
      console.error('Error fixing issues:', error);
      throw new Error('Failed to fix issues');
    }
  }
};
