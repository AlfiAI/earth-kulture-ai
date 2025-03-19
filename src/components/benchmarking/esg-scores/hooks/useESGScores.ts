
import { useState, useCallback } from 'react';
import { CompanyESGData, IndustryComparisonData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useESGScores() {
  const [companyData, setCompanyData] = useState<CompanyESGData | null>(null);
  const [comparisonData, setComparisonData] = useState<IndustryComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCompany = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the Finnhub edge function
      const { data, error: functionError } = await supabase.functions.invoke('finnhub-esg', {
        body: { query }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data || !data.company) {
        throw new Error('No company data found');
      }

      setCompanyData(data.company);
      setComparisonData(data.industryComparison);
      
    } catch (err) {
      console.error('Error fetching ESG scores:', err);
      setError((err instanceof Error) ? err.message : 'Failed to fetch ESG data');
      toast.error('Failed to fetch ESG scores');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    searchCompany,
    companyData,
    comparisonData,
    isLoading,
    error
  };
}
